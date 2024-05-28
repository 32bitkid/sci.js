export type Vec2 = [number, number];

export const intVec2 = (
  [x, y]: Readonly<Vec2>,
  fn: (v: number) => number = Math.floor,
): Vec2 => [fn(x), fn(y)];
