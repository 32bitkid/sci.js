export type Vec2 = [number, number];

export const toInt = (
  [x, y]: Readonly<Vec2>,
  fn: (v: number) => number = Math.floor,
): Vec2 => [fn(x), fn(y)];

export const isEqual = (a: Vec2, b: Vec2): boolean =>
  a[0] === b[0] && a[1] === b[1];

export const distanceSquared = (a: Vec2, b: Vec2) => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx ** 2 + dy ** 2;
};
export const distanceBetween = (a: Vec2, b: Vec2) =>
  Math.sqrt(distanceSquared(a, b));
