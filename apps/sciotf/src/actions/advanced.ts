import { readFile, writeFile } from 'node:fs/promises';
import { join as pathJoin } from 'node:path';
import { type FontFace, parseFont, ResourceTypes } from '@4bitlabs/sci0';
import opentype from 'opentype.js';
import type { Sade } from 'sade';
import m from 'transformation-matrix';
import wawoff from 'wawoff2';
import { parseAspectRatio, parseChamfer } from '../opt-parsers.js';
import { charToGlyph } from '../pixel-to-glyph.js';
import { findAndParseFont } from '../utils/find-and-parse.js';
import { guessBaseline } from '../utils/measure.js';
import { range } from '../utils/range.js';
import { padGlyph, shiftGlyph, sumShifts } from './pad-glyph.js';
import {
  type BaselineSchemaType,
  type LineHeightSchemaType,
  type SourceSchemaType,
  tryParse,
} from './schema.js';
import { xorPixels } from './xor-pixels.js';

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

export function advancedAction(prog: Sade) {
  prog
    .command('advanced <file>')
    .alias('adv')
    .describe(
      'Uses a font definition JSON file to compile and modify glyphs from multiple sources',
    )
    .option(
      '--format, -f',
      'output format from "otf" or "woff2". can be used multiple times (default: "otf")',
      'otf',
    )
    .option(
      '--aspect-ratio, -a',
      'set pixel aspect-ratio to "1:1", "1:1.2", or "5:6"',
      '1:1.2',
    )
    .option(
      '--chamfer, -c',
      'set corner chamfer mode from "none", "inside", "outside", "both"',
      'both',
    )
    .option('--output, -o', 'output folder', '.')
    .option('--verbose, -v', 'verbose output', false)
    .action(
      async (
        file: string,
        opts: {
          'aspect-ratio': string;
          chamfer: string;
          output: string;
          verbose: boolean;
          format: string | string[];
        },
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

        // Gather glyphs
        const glyphs: Map<number, opentype.Glyph> = new Map([
          [
            0,
            new opentype.Glyph({
              name: '.notdef',
              advanceWidth: 8 * screenScale.a,
              path: new opentype.Path(),
            }),
          ],
        ]);

        const addGlyph = (
          unicode: number,
          glyph: opentype.Glyph,
          force: boolean = false,
        ): opentype.Glyph => {
          if (glyphs.has(unicode) && !force)
            console.error(
              `warning: U+${unicode.toString(16).padStart(4, '0')} has been mapped multiple times`,
            );
          glyphs.set(unicode, glyph);
          return glyph;
        };

        for (const source of payload.sources) {
          const font = await loadSource(source);

          for (const mapping of source.mappings) {
            if (mapping === 'ascii' || mapping === 'ascii-symbols') {
              for (const i of range(0x20, 0x2f)) {
                let char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = i === 0x20 ? 'SPACE' : String.fromCodePoint(i);
                char = padGlyph(char, payload.pad);
                char = shiftGlyph(char, source.shift);
                addGlyph(
                  i,
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
              }
            }
            if (mapping === 'ascii' || mapping === 'ascii-digits') {
              for (const i of range(0x30, 0x3f)) {
                let char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = String.fromCodePoint(i);
                char = padGlyph(char, payload.pad);
                char = shiftGlyph(char, source.shift);
                addGlyph(
                  i,
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
              }
            }
            if (mapping === 'ascii' || mapping === 'ascii-uppercase') {
              for (const i of range(0x40, 0x5f)) {
                let char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = String.fromCodePoint(i);
                char = padGlyph(char, payload.pad);
                char = shiftGlyph(char, source.shift);
                addGlyph(
                  i,
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
              }
            }
            if (mapping === 'ascii' || mapping === 'ascii-lowercase') {
              for (const i of range(0x60, 0x7d)) {
                let char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = String.fromCodePoint(i);
                char = padGlyph(char, payload.pad);
                char = shiftGlyph(char, source.shift);
                addGlyph(
                  i,
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
              }
            }

            if (Array.isArray(mapping)) {
              const [inputChar, unicode, name, options] = mapping;
              let char = font.characters[Number.parseInt(inputChar, 16)];
              char = padGlyph(char, payload.pad);
              char = padGlyph(char, options?.pad);
              char = shiftGlyph(char, sumShifts(options?.shift, source.shift));
              if (options?.xor) {
                char = xorPixels(char, options.xor);
              }

              const chMat2d = options?.pad?.top
                ? m.compose(mat2d, m.translate(0, -options.pad.top))
                : mat2d;

              addGlyph(
                Number.parseInt(unicode, 16),
                charToGlyph(
                  Number.parseInt(unicode, 16),
                  name.toUpperCase(),
                  char,
                  chMat2d,
                  screenScale.a,
                  chamferMode,
                ),
                options?.force,
              );
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
          glyphs: [...glyphs.values()],
          version: payload.version ?? '1.0.0',
        });

        if (opts.verbose) {
          console.log(`Total Glyphs: ${glyphs.size}\n`);
          console.log('| Code point | Symbol | Name |');
          console.log('|--:|:--:|--|');
          for (const [codepoint, gly] of [...glyphs.entries()].sort(
            (a, b) => a[0] - b[0],
          )) {
            console.log(
              `| U+${codepoint.toString(16).padStart(4, '0').toUpperCase()} | \`${String.fromCodePoint(codepoint)}\` | ${gly.name} |`,
            );
          }
          console.log('\n');
        }

        const outputPath = opts.output ?? '.';
        const formats = Array.isArray(opts.format)
          ? opts.format.map((it) => it.toLowerCase())
          : typeof opts.format === 'string'
            ? [opts.format.toLowerCase()]
            : 'otf';

        const otfBytes = Buffer.from(sciOTF.toArrayBuffer());
        if (formats.includes('otf')) {
          const fileName = `sci${arStr}-${payload.name.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase()}.otf`;
          const fn = pathJoin(outputPath, fileName);
          await writeFile(fn, otfBytes);
          console.log(fn);
        }

        if (formats.includes('woff2')) {
          const fileName = `sci${arStr}-${payload.name.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase()}.woff2`;
          const fn = pathJoin(outputPath, fileName);
          await writeFile(fn, await wawoff.compress(otfBytes));
          console.log(fn);
        }
      },
    );
}
