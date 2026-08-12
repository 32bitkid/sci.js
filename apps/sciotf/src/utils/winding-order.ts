import type { Vec2 } from '@4bitlabs/vec2';

export type Segment<T> = [a: T, b: T, aIdx: number, bIdx: number];

export function* segments<T>(
  points: T[],
  type: 'loop' | 'line',
): Generator<Segment<T>> {
  const length = points.length;
  const end = length + (type === 'loop' ? 0 : -1);
  for (let i = 0; i < end; i++) {
    const next = (i + 1) % length;
    yield [points[i], points[next], i, next];
  }
}

export type WindingOrder = 'cw' | 'ccw';

export function windingOrderOf(points: Vec2[]): WindingOrder {
  let sum = 0;
  for (const [[x0, y0], [x1, y1]] of segments(points, 'loop')) {
    sum += (x1 - x0) * (y1 + y0);
  }
  return sum >= 0 ? 'cw' : 'ccw';
}
