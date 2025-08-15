import { alphaPart as fmtA } from '../utils/alpha-fns';
import { formatFloat as fmt } from '../utils/format-float';
import {
  type ColorPredicate,
  createColorPredicate,
} from '../utils/create-color-predicate';

/**
 * Linear, non gamma-compressed, [sRGB](https://en.wikipedia.org/wiki/SRGB) color space.
 *
 * @see {@link linearRGB.create}
 */
export type linearRGBTuple = [
  'linear-RGB',
  r: number,
  g: number,
  b: number,
  a?: number,
];

/**
 * Create a new {@link linearRGBTuple} from components.
 *
 * @param r **Red** component. Range [0.0&ndash;1.0].
 * @param g **Green** component. Range [0.0&ndash;1.0].
 * @param b **Blue** component. Range [0.0&ndash;1.0].
 * @param a **Alpha** component. Range [0.0&ndash1.0].
 */
export const create = (
  r: number = 0,
  g: number = 0,
  b: number = 0,
  a?: number,
): linearRGBTuple =>
  a !== undefined ? ['linear-RGB', r, g, b, a] : ['linear-RGB', r, g, b];

/**
 * Format the {@link linearRGBTuple} as a string, in [CSS `color(srgb-linear)` format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color).
 *
 * @param rgb
 */
const stringify = ([, r, g, b, alpha]: linearRGBTuple) =>
  `color(srgb-linear ${fmt(r)} ${fmt(g)} ${fmt(b)}${fmtA(alpha)})`;

export { stringify as toString };

/**
 * Type-predicate that validate and match {@link linearRGBTuple}.
 */
export const isLinearRGBTuple: ColorPredicate<linearRGBTuple> =
  createColorPredicate<linearRGBTuple>(
    'isLinearRGBTuple',
    ['linear-RGB'],
    [0.0, 1.0],
    [0.0, 1.0],
    [0.0, 1.0],
  );
