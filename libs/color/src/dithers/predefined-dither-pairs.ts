import { CGA_PALETTE, TRUE_CGA_PALETTE } from '../palettes';
import { generatePairs } from './generate-pairs';
import { softMixer, mixBy } from '../mixers';
import { DitherPair } from './dither-pair';

export const CGA: DitherPair[] = generatePairs(CGA_PALETTE);
export const CGA_MIX: DitherPair[] = generatePairs(CGA_PALETTE, mixBy(0.25));
export const CGA_FLAT: DitherPair[] = generatePairs(CGA_PALETTE, mixBy(0.5));
export const CGA_SOFT: DitherPair[] = generatePairs(CGA_PALETTE, softMixer());

export const TRUE_CGA: DitherPair[] = generatePairs(TRUE_CGA_PALETTE);
export const TRUE_CGA_MIX: DitherPair[] = generatePairs(
  TRUE_CGA_PALETTE,
  mixBy(0.25),
);
export const TRUE_CGA_FLAT: DitherPair[] = generatePairs(
  CGA_PALETTE,
  mixBy(0.5),
);
export const TRUE_CGA_SOFT: DitherPair[] = generatePairs(
  TRUE_CGA_PALETTE,
  softMixer(),
);
