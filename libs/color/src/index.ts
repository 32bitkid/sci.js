export { RAW_CGA } from './cga-palette';
export { TRUE_CGA } from './true-cga-palette';
export { DGA_PALETTE } from './dga-palette';

export { redMeanDiff } from './red-mean-diff';
export { deltaE } from './delta-e';

import { mixBy, softMixer } from './mixers';
export const Mixers = { mixBy, softMixer };

export { generateSciDitherPairs } from './generate-sci-dither-pairs';

export type { DitherPair } from './dither-pair';
export type { DitherTransform } from './dither-transform';
export * as BuiltinDitherPairs from './predefined-dither-pairs';
export { IBM5153Dimmer } from './IBM-5153-dimmer';
export { toGrayscale } from './to-grayscale';
