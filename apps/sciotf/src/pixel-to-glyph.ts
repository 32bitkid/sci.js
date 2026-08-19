import type { Glyph } from '@4bitlabs/sci0';
import { trace } from '@watercolorizer/tracer';
import opentype from 'opentype.js';
import type * as m from 'transformation-matrix';
import type { Matrix } from 'transformation-matrix';
import { chamfer } from './utils/chamfer.js';
import { windingOrderOf } from './utils/winding-order.js';

const applyToPoints = (
  { a, b, c, d, e, f }: m.Matrix,
  ps: (readonly [number, number])[],
): [number, number][] =>
  ps.map(([x, y]) => [a * x + c * y + e, b * x + d * y + f]);

const applyChamfer = (
  points: (readonly [number, number])[],
  chamferMode: 'inside' | 'outside' | 'none' | 'both',
): [number, number][] => {
  const winding = windingOrderOf(points);
  return chamferMode === 'both' ||
    (chamferMode === 'inside' && winding === 'cw') ||
    (chamferMode === 'outside' && winding === 'ccw')
    ? chamfer(points, 1)
    : points.map(([x, y]) => [x, y]);
};

export function charToGlyph(
  unicode: number,
  name: string,
  char: Glyph,
  mat2d: Readonly<Matrix>,
  widthScalar: number,
  chamferMode: 'inside' | 'outside' | 'none' | 'both',
): opentype.Glyph {
  const loops = trace(char.pixels, [char.width, char.height], {
    polygonify: false,
    simplifyRuns: true,
    despeckle: false,
    windingOrder: 'ccw',
    windingRule: 'nonzero',
    emptyValue: char.keyColor,
  });

  const path = new opentype.Path();
  for (const loop of loops) {
    const points = applyToPoints(mat2d, loop);
    const [first, ...rest] = applyChamfer(points, chamferMode);
    path.moveTo(Math.round(first[0]), Math.round(first[1]));
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
