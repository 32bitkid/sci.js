export { RAW_CGA, TRUE_CGA } from './cga-palette';
export { BW_PALETTE } from './bw-palette';
export { DGA_PALETTE } from './dga-palette';
export { redMeanDiff } from './red-mean-diff';

export type { DitherPair, DitherTransform } from './mixers';

import { mixBy, softMixer } from './mixers';

export const Mixers = { mixBy, softMixer };
