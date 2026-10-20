import { assign, type MutableVec2, sub, type Vec2 } from '@4bitlabs/vec2';

export const plineMaxDelta = (points: Vec2[]): number => {
  let d = 0;
  const tmp: MutableVec2 = [0, 0];
  let [current, ...rest] = points;
  for (const next of rest) {
    sub(next, current, tmp);
    d = Math.max(d, Math.abs(tmp[0]), Math.abs(tmp[1]));
    current = next;
  }
  return d;
};

export const p24 = ([x, y]: Vec2): Uint8Array =>
  Uint8Array.of(((x >>> 4) & 0xf0) | ((y >>> 8) & 0x0f), x & 0xff, y & 0xff);

export const p16 = ([x, y]: Vec2): Uint8Array =>
  Uint8Array.of(
    ((y < 0 ? 1 : 0) << 7) | Math.min(127, Math.abs(y)),
    x & 0b1111_1111,
  );

export const p8 = ([x, y]: Vec2): Uint8Array =>
  Uint8Array.of(
    (x >= 0 ? 0 : 1 << 7) |
      (Math.min(7, Math.abs(x)) << 4) |
      (y >= 0 ? 0 : 1 << 3) |
      Math.min(7, Math.abs(y)),
  );

export function* relativePoints(
  points: Vec2[],
  pFn: (p: Vec2) => Uint8Array,
): Generator<Uint8Array, void, unknown> {
  const prev: MutableVec2 = [0, 0];
  const tmp: MutableVec2 = [0, 0];

  const [first, ...rest] = points;
  yield p24(first);
  assign(first, prev);
  for (const next of rest) {
    sub(next, prev, tmp);
    yield pFn(tmp);
    assign(next, prev);
  }
}

export function* absolutePoints(
  points: Vec2[],
  pFn: (p: Vec2) => Uint8Array = p24,
): Generator<Uint8Array, void, unknown> {
  for (const p of points) yield pFn(p);
}
