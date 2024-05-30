import { type Vec2 } from '@4bitlabs/vec2';

export const isInsideBounds = (
  [width, height]: Readonly<Vec2>,
  [x, y]: Readonly<Vec2>,
): boolean => x >= 0 && y >= 0 && x < width && y < height;

export const pixel = ([x, y]: Readonly<Vec2>, offset = 0.0): Vec2[] => [
  [Math.floor(x) + offset, Math.floor(y) + offset],
  [Math.floor(x) + 1 - offset, Math.floor(y) + offset],
  [Math.floor(x) + 1 - offset, Math.floor(y) + 1 - offset],
  [Math.floor(x) + offset, Math.floor(y) + 1 - offset],
];

export const areaOfPolygon = (points: Readonly<Vec2>[]) => {
  const { length } = points;
  let area = 0;

  for (let i = 0; i < length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % length];
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area) / 2;
};

export const pathPoly = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  points: Readonly<Vec2>[],
) => {
  ctx.beginPath();
  points.forEach(([x, y], i) => ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y));
  ctx.closePath();
};

export const rect = ([x0, y0]: Vec2, [x1, y1]: Vec2): Vec2[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];

export function* getSegments(
  points: Vec2[],
  loop = false,
): Generator<[number, number, Vec2, Vec2]> {
  const length = points.length;
  for (let i = 0; i < points.length - (loop ? 0 : 1); i++)
    yield [i, i + 1, points[i], points[(i + 1) % length]];
}

export const isInsidePolygon = (
  verts: Vec2[],
  [x, y]: Vec2,
  loop = true,
): boolean => {
  let inside = false;

  for (const [, , [x0, y0], [x1, y1]] of getSegments(verts, loop)) {
    if (y <= Math.min(y0, y1)) continue;
    if (y > Math.max(y0, y1)) continue;
    if (x > Math.max(x0, x1)) continue;

    const x_intersection = ((y - y0) * (x1 - x0)) / (y1 - y0) + x0;
    if (!(x0 === x1 || x <= x_intersection)) continue;

    inside = !inside;
  }

  return inside;
};
