import { type Vec2 } from '@4bitlabs/vec2';

export const isInsideBounds = (
  [width, height]: Readonly<Vec2>,
  [x, y]: Readonly<Vec2>,
): boolean => x >= 0 && y >= 0 && x < width && y < height;

export const pixel = ([x, y]: Readonly<Vec2>, offset = 0.0): Vec2[] => [
  [Math.floor(x) + offset, Math.floor(y) + offset],
  [Math.ceil(x) - offset, Math.floor(y) + offset],
  [Math.ceil(x) - offset, Math.ceil(y) - offset],
  [Math.floor(x) + offset, Math.ceil(y) - offset],
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
