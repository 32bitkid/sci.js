import type { DitherPair } from './dither-pair.js';

export type DitherTransform = (pair: Readonly<DitherPair>) => DitherPair;
