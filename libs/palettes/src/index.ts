export { RAW_CGA, TRUE_CGA } from './cga-palette';
export { BW_PALETTE } from './bw-palette';
export { DGA_PALETTE } from './dga-palette';

export type { DitherPair, DitherTransform } from './mixers';

export { redMeanDiff } from './red-mean-diff';
export { deltaE } from './delta-e';

import { mixBy, softMixer } from './mixers';
export const Mixers = { mixBy, softMixer };
