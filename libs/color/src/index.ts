export { RAW_CGA } from './cga-palette';
export { TRUE_CGA } from './true-cga-palette';
export { BW_PALETTE } from './bw-palette';
export { DGA_PALETTE } from './dga-palette';

export { redMeanDiff } from './red-mean-diff';
export { deltaE } from './delta-e';

import { mixBy, softMixer } from './mixers';
export const Mixers = { mixBy, softMixer };

export { generateSciDitherPairs } from './generate-sci-dither-pairs';

export type { DitherPair } from './dither-pair';
export type { DitherTransform } from './dither-transform';
export type { Ditherizer } from '@4bitlabs/image/dist/ditherizer';
export * as BuiltinDitherPairs from './predefined-dither-pairs';
