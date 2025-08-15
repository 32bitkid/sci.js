import { formatFloat as fmt } from '../utils/format-float';
import { alphaPart as fmtA } from '../utils/alpha-fns';
import {
  type ColorPredicate,
  createColorPredicate,
} from '../utils/create-color-predicate';

/**
 * [Oklab](https://bottosson.github.io/posts/oklab/) color space.
 *
 * @see {@link okLab.create}
 */
export type okLabTuple = ['okLab', L: number, a: number, b: number, a?: number];

/**
 * Create a new {@link okLabTuple} from components.
 *
 * @param L **Luminance** component. Range [0.0&ndash;1.0].
 * @param a **Green–red** component. Range [&#x2D7;0.5&ndash;0.5].
 * @param b **Blue-yellow** component. Range [&#x2D7;0.5&ndash;0.5].
 * @param alpha **Alpha** component. Range [0.0&ndash1.0].
 */
export const create = (
  L: number = 0,
  a: number = 0,
  b: number = 0,
  alpha?: number,
): okLabTuple =>
  alpha !== undefined ? ['okLab', L, a, b, alpha] : ['okLab', L, a, b];

/**
 * Format the {@link okLabTuple} as a string, in [CSS `lab()` format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklab).
 *
 * @param lab
 */
const stringify = ([, L, a, b, alpha]: okLabTuple) =>
  `oklab(${fmt(L)} ${fmt(a)} ${fmt(b)}${fmtA(alpha)})`;

export { stringify as toString };

/**
 * Type-predicate that validate and match {@link okLabTuple}.
 */
export const isOkLabTuple: ColorPredicate<okLabTuple> =
  createColorPredicate<okLabTuple>(
    'isOkLabTuple',
    ['okLab'],
    [0.0, 1.0],
    [-0.5, 0.5],
    [-0.5, 0.5],
  );
