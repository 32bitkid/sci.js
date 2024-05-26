export type Vec2 = [number, number];
export type StaticVec2 = readonly [number, number];

export const intVec2 = (
  [x, y]: StaticVec2,
  fn: (v: number) => number = Math.floor,
): StaticVec2 => [fn(x), fn(y)];
