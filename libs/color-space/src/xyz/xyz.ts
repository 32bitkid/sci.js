/**
 * @example
 *
 * ```ts
 * import {
 *   create,
 *   mix,
 *   toString,
 *   type XYZTuple,
 * } from '@4bitlabs/color-space/xyz';
 *
 * const cornflowerBlue: XYZTuple = create(50.39, 57.009, 86.941);
 * const black: XYZTuple = create(0, 0, 0);
 *
 * // Mix cornflowerBlue and black at 50% in XYZ color-space.
 * const mixed = mix(cornflowerBlue, black, 0.5);
 *
 * console.log(toString(mixed)); // color(xyz 0.251 0.285 0.434)
 * ```
 *
 * @module
 */
export {
  type XYZTuple,
  create,
  toString,
  isXYZTuple,
} from '../tuples/xyz-tuple';
export { toSRGB, toLab, toOkLab, mix } from './xyz-fns';
