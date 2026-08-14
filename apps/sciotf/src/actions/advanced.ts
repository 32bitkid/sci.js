import type { Sade } from 'sade';
import * as z from 'zod';
import { readFile, writeFile } from 'node:fs/promises';
import opentype from 'opentype.js';
import { findAndParseFont } from '../utils/find-and-parse.js';
import { range } from '../utils/range.js';
import { charToGlyph } from '../pixel-to-glyph.js';
import m from 'transformation-matrix';
import { parseAspectRatio, parseChamfer } from '../opt-parsers.js';
import { guessBaseline } from '../utils/measure.js';

const BaselineSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('constant'),
    value: z.number().gt(0),
  }),
  z.object({
    type: z.literal('source'),
    root: z.string(),
    engine: z.enum(['sci0', 'sci01']).optional(),
    id: z.number(),
    char: z.string().length(1).optional(),
  }),
]);

const LineHeightSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('constant'),
    value: z.number().gt(0),
  }),
  z.object({
    type: z.literal('source'),
    root: z.string(),
    engine: z.enum(['sci0', 'sci01']).optional(),
    id: z.number(),
  }),
]);

const SourceSchema = z.object({
  type: z.literal('source'),
  root: z.string(),
  engine: z.enum(['sci0', 'sci01']).optional(),
  id: z.number(),
  mappings: z
    .array(
      z.union([
        z.literal('ascii'),
        z.literal('ascii-symbols'),
        z.literal('ascii-numbers'),
        z.literal('ascii-uppercase'),
        z.literal('ascii-lowercase'),
        z.tuple([z.hex(), z.hex(), z.string()]),
      ]),
    )
    .min(1),
});

const Batch = z.object({
  name: z.string(),
  aspectRatio: z.enum(['1:1', '5:6']).optional(),
  version: z.string().optional(),
  baseline: BaselineSchema.optional(),
  lineHeight: LineHeightSchema.optional(),
  sources: z.array(SourceSchema),
  chamfer: z
    .enum(['both', 'inside', 'outside', 'none'])
    .optional()
    .default('both'),
});

async function getBaseline(
  defaultSource: z.TypeOf<typeof SourceSchema>,
  option?: z.TypeOf<typeof BaselineSchema>,
) {
  if (option === undefined) {
    const font = await findAndParseFont(
      defaultSource.root,
      defaultSource.id,
      defaultSource.engine ?? 'sci0',
    );
    return guessBaseline(font);
  }

  switch (option.type) {
    case 'constant':
      return option.value;
    case 'source': {
      const font = await findAndParseFont(
        option.root,
        option.id,
        option.engine ?? 'sci0',
      );
      return guessBaseline(font, option.char);
    }
  }
}

async function getLineHeight(
  defaultSource: z.TypeOf<typeof SourceSchema>,
  option?: z.TypeOf<typeof LineHeightSchema>,
) {
  if (option === undefined) {
    const font = await findAndParseFont(
      defaultSource.root,
      defaultSource.id,
      defaultSource.engine ?? 'sci0',
    );
    return font.lineHeight + 1;
  }

  switch (option.type) {
    case 'constant':
      return option.value;
    case 'source': {
      const font = await findAndParseFont(
        option.root,
        option.id,
        option.engine ?? 'sci0',
      );
      return font.lineHeight + 1;
    }
  }
}

function tryParse(json: unknown) {
  try {
    return Batch.parse(json);
  } catch (ex: unknown) {
    if (ex instanceof z.ZodError) {
      console.error(z.prettifyError(ex));
    } else {
      console.error('Something went wrong');
    }
    process.exit(-1);
  }
}

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
        const baseline = await getBaseline(defaultSource, payload.baseline);
        const lineHeight = await getLineHeight(
          defaultSource,
          payload.lineHeight,
        );
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
          const font = await findAndParseFont(
            source.root,
            source.id,
            source.engine ?? 'sci0',
          );

          for (const mapping of source.mappings) {
            if (mapping === 'ascii' || mapping === 'ascii-symbols') {
              for (const i of range(0x20, 0x2f)) {
                const char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = i === 0x20 ? 'SPACE' : String.fromCodePoint(i);
                glyphs.push(
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
                visit(i);
              }
            }
            if (mapping === 'ascii' || mapping === 'ascii-numbers') {
              for (const i of range(0x30, 0x3f)) {
                const char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = String.fromCodePoint(i);
                glyphs.push(
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
                visit(i);
              }
            }
            if (mapping === 'ascii' || mapping === 'ascii-uppercase') {
              for (const i of range(0x40, 0x5f)) {
                const char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = String.fromCodePoint(i);
                glyphs.push(
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
                visit(i);
              }
            }
            if (mapping === 'ascii' || mapping === 'ascii-lowercase') {
              for (const i of range(0x60, 0x7f)) {
                const char = font.characters[i];
                if (char.width <= 1 && char.height <= 1) continue;
                const name = String.fromCodePoint(i);
                glyphs.push(
                  charToGlyph(i, name, char, mat2d, screenScale.a, chamferMode),
                );
                visit(i);
              }
            }

            if (Array.isArray(mapping)) {
              const [inputChar, unicode, name] = mapping;
              const char = font.characters[Number.parseInt(inputChar, 16)];
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
