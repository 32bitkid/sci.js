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
import type { Matrix } from 'transformation-matrix';

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

function charToGlyph(
  unicode: number,
  name: string,
  char: IndexedPixelData,
  mat2d: Readonly<Matrix>,
  widthScalar: number,
): opentype.Glyph {
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
    name,
    unicode,
    advanceWidth: char.width * widthScalar,
    path,
  });
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
  .action(
    async (
      idArg: string,
      opts: {
        'aspect-ratio'?: string;
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
          if (char.width <= 1 && char.height <= 1) return null;
          return charToGlyph(
            i,
            String.fromCodePoint(i),
            char,
            mat2d,
            screenScale.a,
          );
        }),
        ...(
          [
            [0x04, 0x00a9, 'copyright sign'],
            [0x05, 0x2122, 'trademark symbol'],
            [0x0b, 0x2642, 'male symbol'],
            [0x0c, 0x2640, 'female symbol'],
            [0x0d, 0x266a, 'eighth note'],
            [0x0e, 0x266c, 'beamed 16th note'],

            [0x10, 0x25b6, 'black right-pointing triangle'],
            [0x11, 0x25c2, 'black left-pointing triangle'],
            [0x1e, 0x25b2, 'black left-pointing triangle'],
            [0x1f, 0x25bc, 'black left-pointing triangle'],

            [0x18, 0x2191, 'up-pointing arrow'],
            [0x19, 0x2193, 'down-pointing arrow'],
            [0x1a, 0x2192, 'right-pointing arrow'],
            [0x1b, 0x2190, 'left-pointing arrow'],
            [0x12, 0x2195, 'vertical-pointing arrow'],
            [0x1d, 0x2194, 'horizontal-pointing arrow'],
            [0x16, 0x25ac, 'black rectangle'],
            [0x17, 0x21A8, 'up down arrow with base'],

            [0x01, 0x26f0, 'mountain'],
            [0x13, 0x203c, 'double exclamation mark'],
            [0x14, 0x00b6, 'pilcrow sign'],
            [0x15, 0x00a7, 'section sign'],
            [0x1c, 0x221F, 'right angle'],
            [0x0f, 0x263c, 'solar symbol'],
            [0x03, 0x2388, 'helm symbol'],
            [0x02, 0x2387, 'alternative key symbol'],
            [0x08, 0x232b, 'erase to the left'],
            [0x09, 0x2b7e, 'horizontal tab key'],
          ] satisfies [number, number, string][]
        ).flatMap(([i, unicode, name]) => {
          const char = font.characters[i];
          if (char.width <= 2 && char.height <= 1) return [];
          return charToGlyph(
            unicode,
            name.toUpperCase(),
            char,
            mat2d,
            screenScale.a,
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
