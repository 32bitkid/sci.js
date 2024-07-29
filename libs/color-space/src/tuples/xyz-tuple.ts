import { formatFloat as fmt } from '../utils/format-float';
import { alphaPart as fmtA } from '../utils/alpha-fns';
import {
  type ColorPredicate,
  createColorPredicate,
} from '../utils/create-color-predicate';
import { D65 } from '../reference-white';

/**
 * [CIE-XYZ](https://en.wikipedia.org/wiki/CIE_1931_color_space) color space.
 *
 * @see {@link XYZ.create}
 */
export type XYZTuple = ['CIE-XYZ', x: number, y: number, z: number, a?: number];

/**
 * Create a new {@link XYZTuple} from components.
 *
 * @param x **L/M-Cone** component. Range [0.0&ndash;95.046].
 * @param y **Luminance** component. Range [0.0&ndash;100].
 * @param z **S-Cone** component. Range [0.0&ndash;108.91].
 * @param a **Alpha** component. Range [0.0&ndash1.0].
 */
export const create = (
  x: number = 0,
  y: number = 0,
  z: number = 0,
  a?: number,
): XYZTuple =>
  a !== undefined ? ['CIE-XYZ', x, y, z, a] : ['CIE-XYZ', x, y, z];

/**
 * Format the {@link XYZTuple} as a string, in [CSS `color(xyz)` format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color).
 *
 * @param xyz
 */
export const toString = ([, x, y, z, alpha]: XYZTuple) =>
  `color(xyz ${fmt(x / 100)} ${fmt(y / 100)} ${fmt(z / 100)}${fmtA(alpha)})`;

/**
 * Type-predicate that validate and match {@link XYZTuple}.
 */
export const isXYZTuple: ColorPredicate<XYZTuple> =
  createColorPredicate<XYZTuple>(
    'isXYZTuple',
    ['CIE-XYZ'],
    [0, D65[0]],
    [0, D65[1]],
    [0, D65[2]],
  );
