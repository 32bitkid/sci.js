import { readFile, writeFile } from 'node:fs/promises';
import { join as pathJoin } from 'node:path';
import type { Glyph } from '@4bitlabs/sci0';
import opentype from 'opentype.js';
import type { Sade } from 'sade';
import m from 'transformation-matrix';
import wawoff from 'wawoff2';

import { parseAspectRatio, parseChamfer } from '../opt-parsers.js';
import { charToGlyph } from '../pixel-to-glyph.js';
import { guessBaseline } from '../utils/measure.js';
import {
  type BaselineSchemaType,
  type LineHeightSchemaType,
  type SourceSchemaType,
  tryParse,
} from './schema.js';
import { loadSource } from './load-source.js';
import { handleSources_v0, handleSources_v1 } from './handle-sources.js';

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

function advancedAction(prog: Sade) {
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
        const ligatures: [type: 'rlig' | 'liga' | 'dlig', number, number[]][] =
          [];

        const addLigature = (
          type: 'rlig' | 'liga' | 'dlig',
          unicode: number,
          def: string[] | undefined,
        ) => {
          if (!def) return;
          ligatures.push([type, unicode, def.map((it) => parseInt(it, 16))]);
        };

        const glyphMap: Map<number, opentype.Glyph> = new Map();
        const addGlyph = (
          unicode: number,
          name: string,
          char: Glyph,
          glyMat: m.Matrix = m.identity(),
          overwrite: boolean = false,
        ): opentype.Glyph => {
          if (glyphMap.has(unicode) && !overwrite) {
            console.error(
              `warning: U+${unicode.toString(16).padStart(4, '0')} has been mapped multiple times`,
            );
          } else if (!glyphMap.has(unicode) && overwrite) {
            console.error(
              `warning: U+${unicode.toString(16).padStart(4, '0')} overwriting, but not previously set`,
            );
          }

          const chMat2d = m.compose(mat2d, glyMat);
          const glyph = charToGlyph(
            unicode,
            name,
            char,
            chMat2d,
            screenScale.a,
            chamferMode,
          );

          glyphMap.set(unicode, glyph);
          return glyph;
        };

        switch (payload.$version) {
          case 'v1': {
            await handleSources_v1(payload, { addGlyph, addLigature });
            break;
          }
          default:
            await handleSources_v0(payload, { addGlyph, addLigature });
        }

        const glyphs = [
          new opentype.Glyph({
            name: '.notdef',
            advanceWidth: 8 * screenScale.a,
            path: new opentype.Path(),
          }),
          ...[...glyphMap.values()].sort(
            (a, b) => (a.unicode ?? 0) - (b.unicode ?? 0),
          ),
        ];

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
          glyphs: glyphs,
          version: payload.version ?? '1.0.0',
        });

        for (const [type, byChar, subChars] of ligatures) {
          const [subA, subB, ...subRest] = subChars.map((it) =>
            sciOTF.charToGlyphIndex(String.fromCodePoint(it)),
          );

          sciOTF.substitution.addLigature(type, {
            sub: [subA, subB, ...subRest],
            by: sciOTF.charToGlyphIndex(String.fromCodePoint(byChar)),
          });
        }

        if (opts.verbose) {
          console.log(`Total Glyphs: ${glyphMap.size}\n`);
          console.log('| Code point | Symbol | Name |');
          console.log('|--:|:--:|--|');
          for (const [codepoint, gly] of [...glyphMap.entries()].sort(
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

export default advancedAction;
