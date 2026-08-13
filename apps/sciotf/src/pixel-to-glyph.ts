import { trace } from '@watercolorizer/tracer';
import opentype from 'opentype.js';
import type * as m from 'transformation-matrix';

import type { IndexedPixelData } from '@4bitlabs/image';
import { chamfer } from './utils/chamfer.js';
import type { Matrix } from 'transformation-matrix';

const applyToPoints = (
  { a, b, c, d, e, f }: m.Matrix,
  ps: (readonly [number, number])[],
): [number, number][] =>
  ps.map(([x, y]) => [a * x + c * y + e, b * x + d * y + f]);

export function charToGlyph(
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
