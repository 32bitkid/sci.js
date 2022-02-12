import {
  DGA_PALETTE,
  EGA_PALETTE,
  Mixers,
  DitherPair,
  DitherTransform,
} from '../common';

const rawPairs =
  (pal: Uint32Array = EGA_PALETTE) =>
  (i: number): DitherPair =>
    [pal[(i >>> 4) & 0b1111], pal[(i >>> 0) & 0b1111]];

const ENTRIES = Array(256).fill(0);
export const generateSciDitherPairs = (
  source: Uint32Array | ((entry: number) => DitherPair),
  ...transforms: DitherTransform[]
): DitherPair[] => {
  const fn = typeof source === 'function' ? source : rawPairs(source);
  return transforms.reduce(
    (pairs, tx) => pairs.map(tx),
    ENTRIES.map((_, i) => fn(i)),
  );
};

const CLASSIC: DitherPair[] = generateSciDitherPairs(EGA_PALETTE);
const MIX: DitherPair[] = generateSciDitherPairs(
  EGA_PALETTE,
  Mixers.mixBy(0.45),
);
const SOFT: DitherPair[] = generateSciDitherPairs(
  Uint32Array.of(
    DGA_PALETTE[0],
    DGA_PALETTE[1],
    DGA_PALETTE[2],
    DGA_PALETTE[3],

    EGA_PALETTE[4],
    DGA_PALETTE[5],
    DGA_PALETTE[6],
    DGA_PALETTE[7],

    DGA_PALETTE[8],
    DGA_PALETTE[9],
    DGA_PALETTE[10],
    DGA_PALETTE[11],

    EGA_PALETTE[12],
    DGA_PALETTE[13],
    DGA_PALETTE[14],
    DGA_PALETTE[15],
  ),
  Mixers.softMixer,
);

export { CLASSIC, MIX, SOFT };
