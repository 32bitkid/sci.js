/**
 * @example
 *
 * ```ts
 * import {
 *   create,
 *   mix,
 *   toString,
 *   type LabTuple,
 * } from '@4bitlabs/color-space/lab';
 *
 * const forestGreen: LabTuple = create(50.593, -49.586, 45.015);
 * const white: LabTuple = create(100, -0, -0.009);
 *
 * // Mix forestGreen and white at 50% in CIE-Lab color-space.
 * const mixed = mix(forestGreen, white, 0.5);
 *
 * console.log(toString(mixed)); // lab(75.297 -24.793 22.503)
 * ```
 *
 * @module
 */
export {
  type LabTuple,
  create,
  toString,
  isLabTuple,
} from '../tuples/lab-tuple';
export { toXYZ, lighten, darken, mix, deltaE } from './lab-fns';
