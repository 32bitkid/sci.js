import { writeFile } from 'node:fs/promises';
import opentype from 'opentype.js';
import type { Sade } from 'sade';
import * as m from 'transformation-matrix';
import wawoff from 'wawoff2';
import {
  parseAspectRatio,
  parseChamfer,
  parseEngine,
  parseId,
} from '../opt-parsers.js';
import { charToGlyph } from '../pixel-to-glyph.js';
import { findAndParseFont } from '../utils/find-and-parse.js';
import { guessBaseline } from '../utils/measure.js';
import { mapRange } from '../utils/range.js';

export function otfAction(prog: Sade) {
  prog
    .command('font <id>', 'create a ttf of selected font')
    .alias('otf', 'woff2')
    .option('--root, -r', 'SCI0/SCI01 root directory', '.')
    .option('--engine, -e', 'engine', 'sci0')
    .option('--format, -f', 'output format. "otf" or "woff2"', 'otf')
    .option(
      '--baseline, -b',
      'override the automatic baseline detection (number of pixels)',
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
    .action(
      async (
        idArg: string,
        opts: {
          'aspect-ratio'?: string;
          baseline?: string;
          engine?: string;
          root?: string;
          chamfer?: string;
          format?: string | string[];
        },
      ) => {
        const id = parseId(idArg);
        const engine = parseEngine(opts.engine);
        const chamferMode = parseChamfer(opts.chamfer);

        const [aspectRatio, arStr] = parseAspectRatio(opts['aspect-ratio']);

        const font = await findAndParseFont(opts.root ?? './', id, engine);

        const unitsPerEm = 1024;
        const screenScale = m.compose(m.scale(...aspectRatio), m.scale(64, 64));

        const baseline = opts.baseline
          ? parseInt(opts.baseline, 10)
          : guessBaseline(font);

        const mat2d = m.compose(
          screenScale,
          m.scale(1, -1),
          m.translate(0, -baseline),
        );

        const glyphs = [
          new opentype.Glyph({
            name: '.notdef',
            advanceWidth: 8 * screenScale.a,
            path: new opentype.Path(),
          }),
          ...mapRange(0x20, 0x7e, (i) => {
            const char = font.characters[i];
            if (char.width <= 1 && char.height <= 1) return null;
            const name = i === 0x20 ? 'SPACE' : String.fromCodePoint(i);
            return charToGlyph(
              i,
              name,
              char,
              mat2d,
              screenScale.a,
              chamferMode,
            );
          }),
        ];

        const fontExt = id.toString(10).padStart(3, '0');
        const sciOTF = new opentype.Font({
          familyName: `Sci${arStr} FONT.${fontExt}`,
          fullName: `Sci${arStr} FONT.${fontExt} Regular`,
          styleName: `Regular`,
          weightClass: '400',
          widthClass: '5',
          unitsPerEm: unitsPerEm,
          license: 'CC0 1.0 Universal',
          licenseURL:
            'https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt',
          ascender: baseline * screenScale.d,
          descender: (baseline - (font.lineHeight + 1)) * screenScale.d,
          glyphs,
          version: '1.0.0',
        });

        const formats = Array.isArray(opts.format)
          ? opts.format.map((it) => it.toLowerCase())
          : typeof opts.format === 'string'
            ? [opts.format.toLowerCase()]
            : 'otf';

        const otfBytes = Buffer.from(sciOTF.toArrayBuffer());
        if (formats.includes('otf')) {
          const fn = `sci${arStr}-font-${fontExt}.otf`;
          await writeFile(fn, otfBytes);
          console.log(fn);
        }

        if (formats.includes('woff2')) {
          const payload = await wawoff.compress(otfBytes);
          const fn = `sci${arStr}-font-${fontExt}.woff2`;
          await writeFile(fn, payload);
          console.log(fn);
        }
      },
    );
}
