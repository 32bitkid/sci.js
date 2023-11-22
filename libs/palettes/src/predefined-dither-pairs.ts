import { RAW_CGA } from './cga-palette';
import { mixBy, softMixer } from './mixers';
import { DGA_PALETTE } from './dga-palette';
import { generateSciDitherPairs } from './generate-sci-dither-pairs';
import { createDitherizer, Ditherizer } from './ditherizer';
import { DitherPair } from './dither-pair';

const CLASSIC: DitherPair[] = generateSciDitherPairs(RAW_CGA);

const MIX: DitherPair[] = generateSciDitherPairs(RAW_CGA, mixBy(0.45));

const SOFT: DitherPair[] = generateSciDitherPairs(
  Uint32Array.of(
    DGA_PALETTE[0],
    DGA_PALETTE[1],
    DGA_PALETTE[2],
    DGA_PALETTE[3],

    RAW_CGA[4],
    DGA_PALETTE[5],
    DGA_PALETTE[6],
    DGA_PALETTE[7],

    DGA_PALETTE[8],
    DGA_PALETTE[9],
    DGA_PALETTE[10],
    DGA_PALETTE[11],

    RAW_CGA[12],
    DGA_PALETTE[13],
    DGA_PALETTE[14],
    DGA_PALETTE[15],
  ),
  softMixer(),
);

export const classicDitherer: Ditherizer = createDitherizer(CLASSIC);
export const mixDitherer: Ditherizer = createDitherizer(MIX);
export const softDitherer: Ditherizer = createDitherizer(SOFT);
