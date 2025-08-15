import { alphaPart as fmtA } from '../utils/alpha-fns';
import { formatFloat as fmt } from '../utils/format-float';
import {
  type ColorPredicate,
  createColorPredicate,
} from '../utils/create-color-predicate';

/**
 * 8-bit gamma-compressed [sRGB](https://en.wikipedia.org/wiki/SRGB) color space.
 *
 * @see {@link sRGB.create}
 * @see {@link linearRGBTuple}
 *
 * @example Some example colors
 * ```ts
 * const white: sRGBTuple = ['sRGB', 255, 255, 255];
 * const cornflowerBlue: sRGBTuple = ['sRGB', 0x64, 0x95, 0xED];
 * const transparentBlack: sRGBTuple = ['sRGB', 0, 0, 0, 0.25];
 * ```
 */
export type sRGBTuple = ['sRGB', r: number, g: number, b: number, a?: number];

/**
 * Create a new {@link sRGBTuple} from components.
 *
 * @param r **Red**-color component. Range [0&ndash;255].
 * @param g **Green**-color component. Range [0&ndash;255].
 * @param b **Blue**-color component. Range [0&ndash;255].
 * @param a **Alpha** component. Range [0.0&ndash1.0].
 */
export const create = (
  r: number = 0,
  g: number = 0,
  b: number = 0,
  a?: number,
): sRGBTuple => (a !== undefined ? ['sRGB', r, g, b, a] : ['sRGB', r, g, b]);

/**
 * Format the {@link sRGBTuple} as a string, in [CSS `rgb()` format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb).
 *
 * @param rgb
 */
const stringify = ([, r, g, b, alpha]: sRGBTuple) =>
  `rgb(${fmt(r)} ${fmt(g)} ${fmt(b)}${fmtA(alpha)})`;

export { stringify as toString };

/**
 * Type-predicate that validate and match {@link sRGBTuple}.
 */
export const isSRGBTuple: ColorPredicate<sRGBTuple> =
  createColorPredicate<sRGBTuple>(
    'isSRGBTuple',
    ['sRGB'],
    [0, 255],
    [0, 255],
    [0, 255],
  );
