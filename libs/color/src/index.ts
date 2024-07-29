import * as Palettes from './palettes';
import { mixBy, softMixer } from './mixers';
import {
  CGA_PAIRS,
  CGA_MIX_PAIRS,
  CGA_FLAT_PAIRS,
  CGA_SOFT_PAIRS,
  TRUE_CGA_PAIRS,
  TRUE_CGA_MIX_PAIRS,
  TRUE_CGA_FLAT_PAIRS,
  TRUE_CGA_SOFT_PAIRS,
} from './predefined-dither-pairs';
import { IBM5153Contrast } from './IBM-5153-contrast';

export { generateSciDitherPairs } from './generate-sci-dither-pairs';

export type { DitherPair } from './dither-pair';
export type { DitherTransform } from './dither-transform';
export { toGrayscale } from './to-grayscale';

export { IBM5153Contrast };
export { Palettes };

export const Mixers = { mixBy, softMixer };

export const Dithers = {
  CGA: CGA_PAIRS,
  CGA_MIX: CGA_MIX_PAIRS,
  CGA_FLAT: CGA_FLAT_PAIRS,
  CGA_SOFT: CGA_SOFT_PAIRS,

  TRUE_CGA: TRUE_CGA_PAIRS,
  TRUE_CGA_MIX: TRUE_CGA_MIX_PAIRS,
  TRUE_CGA_FLAT: TRUE_CGA_FLAT_PAIRS,
  TRUE_CGA_SOFT: TRUE_CGA_SOFT_PAIRS,
};
