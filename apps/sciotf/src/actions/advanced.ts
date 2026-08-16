import type { Sade } from 'sade';
import { readFile, writeFile } from 'node:fs/promises';
import opentype from 'opentype.js';
import { findAndParseFont } from '../utils/find-and-parse.js';
import { range } from '../utils/range.js';
import { charToGlyph } from '../pixel-to-glyph.js';
import m from 'transformation-matrix';
import { parseAspectRatio, parseChamfer } from '../opt-parsers.js';
import { guessBaseline } from '../utils/measure.js';
import {
  type BaselineSchemaType,
  type LineHeightSchemaType,
  type SourceSchemaType,
  tryParse,
} from './schema.js';
import {
  parseFont,
  ResourceTypes,
  type Glyph,
  type FontFace,
} from '@4bitlabs/sci0';

async function loadSource(source: SourceSchemaType): Promise<FontFace> {
  switch (source.type) {
    case 'resource': {
      return await findAndParseFont(
        source.root,
        source.id,
        source.engine ?? 'sci0',
      );
    }
    case 'patch': {
      const bytes = await readFile(source.path);
      if (bytes[0] !== (ResourceTypes.FONT_TYPE | 0x80)) {
        console.error(`warn: unexpected resource type ${bytes[0] ^ 0x80}`);
      }
      const payload = bytes.subarray(2);
      return parseFont(payload, { keyColor: 0x00, color: 0xff });
    }
  }
}

async function getBaseline(
  defaultSource: SourceSchemaType,
  option?: BaselineSchemaType,
) {
  if (option === undefined) {
    const font = await loadSource(defaultSource);
    return guessBaseline(font);
  }

  switch (option.type) {
    case 'constant':
      return option.value;
    case 'patch':
    case 'resource': {
      const font = await loadSource(defaultSource);
      return guessBaseline(font, option.char);
    }
  }
}

async function getLineHeight(
  defaultSource: SourceSchemaType,
  option?: LineHeightSchemaType,
) {
  if (option === undefined) {
    const font = await loadSource(defaultSource);
    return font.lineHeight;
  }

  switch (option.type) {
    case 'constant':
      return option.value;
    case 'patch':
    case 'resource': {
      const font = await loadSource(defaultSource);
      return font.lineHeight;
    }
  }
}

function xorPixels(char: Glyph, xor: string[]): Glyph {
  const updated = {
    ...char,
    pixels: Uint8ClampedArray.from(char.pixels),
  };
  for (let y = 0; y < Math.min(char.height, xor.length); y += 1) {
    const line = xor[y] ?? '';
    for (let x = 0; x < Math.min(char.width, line.length); x += 1) {
      const idx = y * char.width + x;
      const left = updated.pixels[idx] !== char.keyColor ? 0xff : 0x00;
      const right = (line[x] ?? ' ') !== ' ' ? 0xff : 0x00;
      updated.pixels[idx] = left ^ right ? char.color : char.keyColor;
    }
  }
  return updated;
}

const padGlyph = (
  glyph: Glyph,
  padding: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  } = {},
): Glyph => {
  const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
  if (top === 0 && right === 0 && bottom === 0 && left === 0) return glyph;

  const [width, height] = [
    glyph.width + left + right,
    glyph.height + top + bottom,
  ];
  const paddedGlyph: Glyph = {
    color: glyph.color,
    height: glyph.height + top + bottom,
    keyColor: glyph.keyColor,
    pixels: new Uint8ClampedArray(width * height),
    width: glyph.width + left + right,
  };

  paddedGlyph.pixels.fill(glyph.keyColor);
  for (let y = 0; y < glyph.height; y += 1) {
    const row = glyph.pixels.subarray(y * glyph.width, (y + 1) * glyph.width);
    paddedGlyph.pixels.set(row, (y + top) * width + left);
  }

  return paddedGlyph;
};

export function advancedAction(prog: Sade) {
  prog
    .command('advanced <file>', 'input file to generate')
    .option(
      '--aspect-ratio',
      'set aspect-ratio to "5:6" or "1:1" (default: "5:6")',
    )
    .option(
      '--chamfer',
      'set corner chamfer mode from "none", "inside", "outside", "both" (default "both")',
    )
    .action(
      async (
        file: string,
        opts: { 'aspect-ratio'?: string; chamfer?: string },
      ) => {
        const json = await readFile(file);
        const payload = tryParse(JSON.parse(new TextDecoder().decode(json)));

        const [aspectRatio, arStr] = parseAspectRatio(
          opts['aspect-ratio'] ?? payload.aspectRatio,
        );

        const defaultSource = payload.sources[0];
        const baseline =
          (await getBaseline(defaultSource, payload.baseline)) +
          (payload.pad?.top ?? 0);
        const lineHeight =
          (await getLineHeight(defaultSource, payload.lineHeight)) +
          (payload.pad?.top ?? 0) +
          (payload.pad?.bottom ?? 0);
        const chamferMode = parseChamfer(opts.chamfer, payload.chamfer);

        const unitsPerEm = 1024;
        const screenScale = m.compose(m.scale(...aspectRatio), m.scale(64, 64));
        const mat2d = m.compose(
          screenScale,
          m.scale(1, -1),
          m.translate(0, -baseline),
        );

        const mapped = new Map<number, true>();
        const visit = (unicode: number) => {
          if (mapped.has(unicode))
            console.error(
              `warning: U+${unicode.toString(16).padStart(4, '0')} has been mapped multiple times`,
            );
          mapped.set(unicode, true);
        };

        // Gather glyphs
        const glyphs: opentype.Glyph[] = [
          new opentype.Glyph({
            name: '.notdef',
            advanceWidth: 8 * screenScale.a,
            path: new opentype.Path(),
          }),
        ];

        for (const source of payload.sources) {
          const font = await loadSource(source);

          for (const mapping of source.mappings) {
            if (mapping === 'ascii' || mapping === 'ascii-symbols') {
              for (const i of range(0x20, 0x2f)) {
                let char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = i === 0x20 ? 'SPACE' : String.fromCodePoint(i);
                char = padGlyph(char, payload.pad);
                glyphs.push(
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
                visit(i);
              }
            }
            if (mapping === 'ascii' || mapping === 'ascii-digits') {
              for (const i of range(0x30, 0x3f)) {
                let char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = String.fromCodePoint(i);
                char = padGlyph(char, payload.pad);
                glyphs.push(
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
                visit(i);
              }
            }
            if (mapping === 'ascii' || mapping === 'ascii-uppercase') {
              for (const i of range(0x40, 0x5f)) {
                let char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = String.fromCodePoint(i);
                char = padGlyph(char, payload.pad);
                glyphs.push(
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
                visit(i);
              }
            }
            if (mapping === 'ascii' || mapping === 'ascii-lowercase') {
              for (const i of range(0x60, 0x7f)) {
                let char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = String.fromCodePoint(i);
                char = padGlyph(char, payload.pad);
                glyphs.push(
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
                visit(i);
              }
            }

            if (Array.isArray(mapping)) {
              const [inputChar, unicode, name, options] = mapping;
              let char = font.characters[Number.parseInt(inputChar, 16)];
              char = padGlyph(char, payload.pad);
              if (options?.pad) char = padGlyph(char, options.pad);
              if (options?.xor) {
                char = xorPixels(char, options.xor);
              }
              glyphs.push(
                charToGlyph(
                  Number.parseInt(unicode, 16),
                  name.toUpperCase(),
                  char,
                  mat2d,
                  screenScale.a,
                  chamferMode,
                ),
              );
              visit(Number.parseInt(unicode, 16));
            }
          }
        }

        const sciOTF = new opentype.Font({
          familyName: `Sci${arStr} ${payload.name}`,
          fullName: `Sci${arStr} ${payload.name} Regular`,
          styleName: `Regular`,
          weightClass: '400',
          widthClass: '5',
          unitsPerEm: unitsPerEm,
          license: 'CC0 1.0 Universal',
          licenseURL:
            'https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt',
          ascender: baseline * screenScale.d,
          descender: (baseline - lineHeight) * screenScale.d,
          glyphs,
          version: payload.version ?? '1.0.0',
        });

        const fileName = `sci${arStr}-${payload.name.replace(/\./g, '-').toLowerCase()}.otf`;
        await writeFile(fileName, Buffer.from(sciOTF.toArrayBuffer()));
        console.log(fileName);
      },
    );
}
