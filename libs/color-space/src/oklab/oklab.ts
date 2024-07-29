/**
 * @example
 *
 * ```ts
 * import { create, mix, type okLabTuple } from '@4bitlabs/color-space/oklab';
 *
 * const salmon: okLabTuple = create(0.8, 0.144, 0.083);
 * const cyan: okLabTuple = create(0.8, -0.125, -0.217);
 *
 * // Mix salmon and cyan at 50% in okLab color-space.
 * const mixed = mix(salmon, cyan, 0.5);
 *
 * console.log(mixed); // oklab(0.8 0.009 -0.067)
 * ```
 *
 * @module
 */
export {
  type okLabTuple,
  create,
  toString,
  isOkLabTuple,
} from '../tuples/oklab-tuple';
export { toXYZ, lighten, darken, mix } from './oklab-fns';
