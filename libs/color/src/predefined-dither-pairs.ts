import { CGA_PALETTE } from './palettes/cga-palette';
import { TRUE_CGA_PALETTE } from './palettes/true-cga-palette';
import { generateSciDitherPairs as generate } from './generate-sci-dither-pairs';
import { mixBy, softMixer } from './mixers';

export const CGA_PAIRS = generate(CGA_PALETTE);
export const CGA_MIX_PAIRS = generate(CGA_PALETTE, mixBy(0.25));
export const CGA_FLAT_PAIRS = generate(CGA_PALETTE, mixBy(0.5));
export const CGA_SOFT_PAIRS = generate(CGA_PALETTE, softMixer());

export const TRUE_CGA_PAIRS = generate(TRUE_CGA_PALETTE);
export const TRUE_CGA_MIX_PAIRS = generate(TRUE_CGA_PALETTE, mixBy(0.25));
export const TRUE_CGA_FLAT_PAIRS = generate(CGA_PALETTE, mixBy(0.5));
export const TRUE_CGA_SOFT_PAIRS = generate(TRUE_CGA_PALETTE, softMixer());
