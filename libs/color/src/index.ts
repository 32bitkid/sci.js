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

export { redMeanDiff } from './red-mean-diff';
export { deltaE } from './delta-e';

export { generateSciDitherPairs } from './generate-sci-dither-pairs';

export type { DitherPair } from './dither-pair';
export type { DitherTransform } from './dither-transform';
export { toGrayscale } from './to-grayscale';

export { IBM5153Contrast };
export { Palettes };

export const Mixers = { mixBy, softMixer };

export const Pairs = {
  CGA: CGA_PAIRS,
  CGA_MIX: CGA_MIX_PAIRS,
  CGA_FLAT: CGA_FLAT_PAIRS,
  CGA_SOFT: CGA_SOFT_PAIRS,

  TRUE_CGA: TRUE_CGA_PAIRS,
  TRUE_CGA_MIX: TRUE_CGA_MIX_PAIRS,
  TRUE_CGA_FLAT: TRUE_CGA_FLAT_PAIRS,
  TRUE_CGA_SOFT: TRUE_CGA_SOFT_PAIRS,
};

// TODO remove deprecated exports in next major release
/**
 * @deprecated use Palettes.CGA_PALETTE instead
 */
export const RAW_CGA = Palettes.CGA_PALETTE;

/**
 * @deprecated use Palettes.TRUE_CGA_PALETTE instead
 */
export const TRUE_CGA = Palettes.TRUE_CGA_PALETTE;

/**
 * @deprecated use Palettes.DGA_PALETTE instead
 */
export const DGA_PALETTE = Palettes.DGA_PALETTE;

/**
 * @deprecated use Pairs.* instead
 */
export const BuiltinDitherPairs = {
  CLASSIC: CGA_PAIRS,
  MIX: CGA_MIX_PAIRS,
  SOFT: CGA_SOFT_PAIRS,
};

/**
 * @deprecated use IBM5153Contrast instead
 */
export const IBM5153Dimmer = IBM5153Contrast;
