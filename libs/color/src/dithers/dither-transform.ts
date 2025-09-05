import type { DitherPair } from './dither-pair';

export type DitherTransform = (pair: Readonly<DitherPair>) => DitherPair;
