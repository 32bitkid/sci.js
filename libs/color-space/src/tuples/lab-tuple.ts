import { formatFloat as fmt } from '../utils/format-float';
import { alphaPart as fmtA } from '../utils/alpha-fns';
import {
  type ColorPredicate,
  createColorPredicate,
} from '../utils/create-color-predicate';

/**
 * [CIELAB](https://en.wikipedia.org/wiki/CIELAB_color_space) color space.
 *
 * @see {@link Lab.create}
 */
export type LabTuple = [
  'CIELAB' | 'CIE-L*a*b*',
  L: number,
  a: number,
  b: number,
  a?: number,
];

/**
 * Create a new {@link LabTuple} from components.
 *
 * @param L **Luminance** component. Range [0.0&ndash;100].
 * @param a **Green–red** component. Range [&#x2D7;160.0&ndash;160.0].
 * @param b **Blue-yellow** component. Range [&#x2D7;160.0&ndash;160.0].
 * @param alpha **Alpha** component. Range [0.0&ndash1.0].
 */
export const create = (
  L: number = 0,
  a: number = 0,
  b: number = 0,
  alpha?: number,
): LabTuple =>
  alpha !== undefined ? ['CIELAB', L, a, b, alpha] : ['CIELAB', L, a, b];

/**
 * Format the {@link LabTuple} as a string, in [CSS `lab()` format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lab).
 *
 * @param lab
 */
const stringify = ([, L, a, b, alpha]: LabTuple) =>
  `lab(${fmt(L)} ${fmt(a)} ${fmt(b)}${fmtA(alpha)})`;

export { stringify as toString };

/**
 * Type-predicate that validate and match {@link LabTuple}.
 */
export const isLabTuple: ColorPredicate<LabTuple> =
  createColorPredicate<LabTuple>(
    'isLabTuple',
    ['CIELAB', 'CIE-L*a*b*'],
    [0, 100],
    [-160, 160],
    [-160, 160],
  );
