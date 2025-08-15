import { scalarLerp } from './maths';

/** An immutable two-component vector. */
export type Vec2 = readonly [number, number];

/** A mutable two-component vector. */
export type MutableVec2 = [number, number];

/** A readonly vector at (0,0). */
export const ZERO: Vec2 = [0, 0];

/** Create a vector with component (X, Y), defaults to (0,0). */
export const vec2 = (x: number = 0, y: number = 0): MutableVec2 => [x, y];

/** Clone the source vector into a new vector. */
export const clone = (source: Vec2): MutableVec2 => assign(source, [0, 0]);

/** Assign dest vector to the components of source vector. */
export const assign = (source: Vec2, dest: MutableVec2): MutableVec2 => {
  [dest[0], dest[1]] = source;
  return dest;
};

/** Set the components of out to X, Y. */
export const set = (x: number, y: number, out: MutableVec2): MutableVec2 => {
  out[0] = x;
  out[1] = y;
  return out;
};

export type RoundingMethodFn = (v: number) => number;

/**
 * Round the given vector using method, defaults to Math.round. Puts the result in out.
 *
 * @param vec
 * @param method
 * @param out
 */
export const round = (
  [x, y]: Vec2,
  method: RoundingMethodFn = Math.round,
  out: MutableVec2 = [0, 0],
): MutableVec2 => set(method(x), method(y), out);

/**
 * Adds vector A to vector B `(a + b)`, and puts the result in out.
 *
 * @param a
 * @param b
 * @param out
 */
export const add = (
  [x0, y0]: Vec2,
  [x1, y1]: Vec2,
  out: MutableVec2 = [0, 0],
): MutableVec2 => set(x0 + x1, y0 + y1, out);

/**
 * Subtract vector second from the first vector `(a - b)`, and put the result in out.
 *
 * @param a
 * @param b
 * @param out
 */
export const sub = (
  [x0, y0]: Vec2,
  [x1, y1]: Vec2,
  out: MutableVec2 = [0, 0],
): MutableVec2 => set(x0 - x1, y0 - y1, out);

/**
 * Scale a vector by a scalar, and put the result in out.
 *
 * @param vec
 * @param scalar
 * @param out
 */
export const scale = (
  [x, y]: Vec2,
  scalar: number,
  out: MutableVec2 = [0, 0],
): MutableVec2 => set(x * scalar, y * scalar, out);

/** Get the dot-product of vector A and vector B. */
export const dot = (a: Vec2, b: Vec2): number => a[0] * b[0] + a[1] * b[1];

/**
 * Rotate Vec2 around the origin by &theta;.
 *
 * @param source
 * @param theta The angle of rotation, in radians.
 * @param out
 */
export const rotate = (
  source: MutableVec2,
  theta: number,
  out: MutableVec2 = source,
): MutableVec2 => {
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  [out[0], out[1]] = [
    source[0] * cos - source[1] * sin,
    source[0] * sin + source[1] * cos,
  ];
  return out;
};

/** Project point P onto the line-segment AB‾. */
export const project = (
  a: Vec2,
  b: Vec2,
  p: Vec2,
  out: MutableVec2 = [0, 0],
): MutableVec2 => {
  const vecAB = sub(b, a);
  const vecAP = sub(p, a);

  const lenSqrd = squaredLength(vecAB);
  if (lenSqrd === 0) return assign(a, out);

  const dotAB_AP = dot(vecAB, vecAP);

  const mag = dotAB_AP / lenSqrd;
  if (mag < 0) return assign(a, out);
  if (mag >= 1) return assign(b, out);

  scale(vecAB, mag, out);
  return add(a, out, out);
};

/** Returns true if the vectors have the same components. */
export const isEqual = (a: Vec2, b: Vec2): boolean =>
  a[0] === b[0] && a[1] === b[1];

/** Returns the distance-squared between vectors A and B. */
export const squaredDistanceBetween = (a: Vec2, b: Vec2): number => {
  const [dx, dy] = sub(b, a);
  return dx ** 2 + dy ** 2;
};

/** Returns the Euclidean distance between vectors A and B. */
export const distanceBetween = (a: Vec2, b: Vec2): number =>
  Math.sqrt(squaredDistanceBetween(a, b));

/** Returns the squared-length of vector A from (0,0). */
export const squaredLength = (a: Vec2): number =>
  squaredDistanceBetween(ZERO, a);

/** Returns the Euclidean length of vector A from (0,0). */
export const length = (a: Vec2): number => distanceBetween(ZERO, a);

/** Normalize the source vector into dest. */
export const normalize = (source: Vec2, dest: MutableVec2): MutableVec2 =>
  scale(source, 1 / length(source), dest);

/**
 *
 * @param vec
 * @param angleBrackets
 */
const stringify = (
  [x, y]: MutableVec2,
  { angleBrackets = false }: { angleBrackets?: boolean } = {},
) =>
  `${angleBrackets ? '\u27E8' : '('}${x}, ${y}${angleBrackets ? '\u27E9' : ')'}`;

export { stringify as toString };

/** Perform a linear-interpolation from vector A to vector B by `t`. `t` can be either a scalar or a Vec2. */
export const lerp = (
  a: Vec2,
  b: Vec2,
  t: number | Vec2,
  out: MutableVec2 = [0, 0],
): MutableVec2 => {
  const [tX, tY] = typeof t === 'number' ? [t, t] : t;
  return set(scalarLerp(a[0], b[0], tX), scalarLerp(a[1], b[1], tY), out);
};
