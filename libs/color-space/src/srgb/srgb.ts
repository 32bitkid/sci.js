/**
 * @example
 *
 * ```ts
 * import {
 *   fromHex,
 *   fromUint32,
 *   mix,
 *   toHex,
 *   toString,
 *   type sRGBTuple,
 * } from '@4bitlabs/color-space/srgb';
 *
 * // Parse from hex code
 * const color1: sRGBTuple = fromHex('#ff6347');
 *
 * // Parse from a uint32 in little-endian (0xaabbggrr) byte order.
 * const color2: sRGBTuple = fromUint32(0xffed9564);
 *
 * // Mix color 1 and color 2 at 50% in sRGB color-space.
 * const color3: sRGBTuple = mix(color1, color2, 0.5);
 *
 * console.log(toHex(color3)); // "#b17c9a"
 * console.log(toString(color3)); // "rgb(177 124 154)"
 * ```
 *
 * @module
 */
export {
  type sRGBTuple,
  create,
  toString,
  isSRGBTuple,
} from '../tuples/srgb-tuple';

export {
  toLinearRGB,
  toXYZ,
  toUint32,
  toHex,
  fromUint32,
  fromHex,
  mix,
  redMeanDiff,
} from './srgb-fns';

export type { ToUint32Options, FromUint32Options } from './uint32-options';
