/** Two component vector */
export type Vec2 = [number, number];

/** A readonly vector at (0 0) */
export const ZERO: Readonly<Vec2> = [0, 0];

/** Create a vector with component (X, Y), defaults to (0,0) */
export const vec2 = (x: number = 0, y: number = 0): Vec2 => [x, y];

/** Clone the source vector into a new vector */
export const clone = (source: Readonly<Vec2>): Vec2 => assign(source, [0, 0]);

/** Assign dest vector to the components of source vector */
export const assign = (source: Readonly<Vec2>, dest: Vec2) => {
  [dest[0], dest[1]] = source;
  return dest;
};

/** Set the components of out to X, Y */
export const set = (x: number, y: number, out: Vec2) => {
  out[0] = x;
  out[1] = y;
  return out;
};

/** Round the given vector using method, defaults to Math.round. Puts the result in out */
export const round = (
  [x, y]: Readonly<Vec2>,
  out: Vec2 = [0, 0],
  method: (v: number) => number = Math.round,
): Vec2 => set(method(x), method(y), out);

/** Adds vector a to vector b, and puts the result in out */
export const add = (
  [x0, y0]: Readonly<Vec2>,
  [x1, y1]: Readonly<Vec2>,
  out: Vec2 = [0, 0],
) => set(x0 + x1, y0 + y1, out);

/** Subtract vector second from the first vector, and put the result in out  */
export const sub = (
  [x0, y0]: Readonly<Vec2>,
  [x1, y1]: Readonly<Vec2>,
  out: Vec2 = [0, 0],
): Vec2 => set(x0 - x1, y0 - y1, out);

/** Scale a vector by a scalar, and put the result in out */
export const scale = (
  [x, y]: Readonly<Vec2>,
  scalar: number,
  out: Vec2 = [0, 0],
): Vec2 => set(x * scalar, y * scalar, out);

/** Get the dot-product of a vector */
export const dot = (a: Readonly<Vec2>, b: Readonly<Vec2>) =>
  a[0] * b[0] + a[1] * b[1];

/** Project point P onto the line-segment AB‾ */
export const project = (
  a: Readonly<Vec2>,
  b: Readonly<Vec2>,
  p: Vec2,
  out: Vec2 = [0, 0],
): Vec2 => {
  const vecAB = sub(b, a);
  const vecAP = sub(p, a);

  const vecBA = sub(a, b);
  const vecBP = sub(p, b);

  const dotAB_AP = dot(vecAB, vecAP);
  const dotBA_BP = dot(vecBA, vecBP);

  if (dotBA_BP < 0) return assign(b, out);
  if (dotAB_AP < 0) return assign(a, out);

  const mag = dotAB_AP / squaredLength(vecAB);
  scale(vecAB, mag, out);
  return add(a, out, out);
};

/** Returns true if the vectors have the same components */
export const isEqual = (a: Readonly<Vec2>, b: Readonly<Vec2>): boolean =>
  a[0] === b[0] && a[1] === b[1];

/** Returns the distance-squared between vectors A and B */
export const squaredDistanceBetween = (
  a: Readonly<Vec2>,
  b: Readonly<Vec2>,
) => {
  const [dx, dy] = sub(b, a);
  return dx ** 2 + dy ** 2;
};

/** Returns the Euclidean distance between vectors A and B */
export const distanceBetween = (a: Readonly<Vec2>, b: Readonly<Vec2>) =>
  Math.sqrt(squaredDistanceBetween(a, b));

/** Returns the squared-length of vector A from (0,0) */
export const squaredLength = (a: Readonly<Vec2>) =>
  squaredDistanceBetween(ZERO, a);

/** Returns the Euclidean length of vector A from (0,0) */
export const length = (a: Readonly<Vec2>) => distanceBetween(ZERO, a);

export const toString = (
  [x, y]: Vec2,
  { angleBrackets = false }: { angleBrackets?: boolean } = {},
) =>
  `${angleBrackets ? '\u27E8' : '('}${x}, ${y}${angleBrackets ? '\u27E9' : ')'}`;
