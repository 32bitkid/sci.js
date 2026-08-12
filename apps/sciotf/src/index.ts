#!/usr/bin/env node
import sade from 'sade';
import { findAndParseFont } from './utils/find-and-parse.js';
import { trace } from '@watercolorizer/tracer';
import opentype from 'opentype.js';
import { writeFile } from 'node:fs/promises';
import * as m from 'transformation-matrix';

import type { FontFace } from '@4bitlabs/sci0';
import type { IndexedPixelData } from '@4bitlabs/image';
import { chamfer } from './utils/chamfer.js';
import { mapRange, range } from './utils/range.js';
import { parseAspectRatio, parseEngine, parseId } from './opt-parsers.js';

const applyToPoints = (
  { a, b, c, d, e, f }: m.Matrix,
  ps: (readonly [number, number])[],
): [number, number][] =>
  ps.map(([x, y]) => [a * x + c * y + e, b * x + d * y + f]);

const prog = sade('@4bitlabs/scifont');

prog
  .version(process.env.__VERSION__ ?? 'unknown')
  .option('--root, -r', 'SCI0/SCI01 root directory')
  .option('--engine, -e', 'engine');

function actualBottom(char: IndexedPixelData): number {
  for (let dy = 0; dy < char.height; dy++) {
    const y = char.height - dy - 1;
    const empty = [...range(0, char.width - 1)].every(
      (x) => char.pixels[x + y * char.width] === char.keyColor,
    );
    if (!empty) return y + 1;
  }

  return char.height - 1;
}

function guessBaseline(font: FontFace): number {
  const xChar = font.characters['x'.charCodeAt(0)];
  return actualBottom(xChar);
}

prog
  .command('otf <id>', 'create a ttf of selected font')
  .option(
    '--baseline, -b',
    'override the automatic baseline detection (number of pixels)',
  )
  .option(
    '--aspect-ratio',
    'set aspect-ratio to "5:6" or "1:1" (default: "5:6")',
  )
  .option('--author')
  .action(
    async (
      idArg: string,
      opts: {
        'aspect-ratio'?: string;
        author?: string;
        baseline?: string;
        engine?: string;
        root?: string;
      },
    ) => {
      const id = parseId(idArg);
      const engine = parseEngine(opts.engine);

      const [aspectRatio, arStr] = parseAspectRatio(opts['aspect-ratio']);

      const font = await findAndParseFont(opts.root ?? './', id, engine);

      const unitsPerEm = 1000;
      const screenScale = m.compose(
        m.scale(
          unitsPerEm / 16 / aspectRatio[0],
          unitsPerEm / 16 / aspectRatio[0],
        ),
        m.scale(...aspectRatio),
      );

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
          const loops = trace(char.pixels, [char.width, char.height], {
            polygonify: false,
            simplifyRuns: true,
            despeckle: false,
            windingRule: 'nonzero',
          });

          const path = new opentype.Path();
          for (const loop of loops) {
            const points = applyToPoints(mat2d, loop);
            const [first, ...rest] = chamfer(points, 1);
            path.moveTo(first[0], first[1]);
            for (const [x, y] of rest) {
              path.lineTo(Math.round(x), Math.round(y));
            }
            path.closePath();
          }

          return new opentype.Glyph({
            name: String.fromCodePoint(i),
            unicode: i,
            advanceWidth: char.width * screenScale.a,
            path,
          });
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
        descender: (baseline - font.lineHeight) * screenScale.d,
        glyphs,
        version: '1.0.0',
      });

      await writeFile(
        `sci${arStr}-font-${fontExt}.otf`,
        Buffer.from(sciOTF.toArrayBuffer()),
      );
    },
  );

prog.parse(process.argv);
