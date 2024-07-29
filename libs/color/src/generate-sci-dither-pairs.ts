import { DitherPair } from './dither-pair';
import { DitherTransform } from './dither-transform';

const rawPairs =
  (pal: Uint32Array) =>
  (i: number): DitherPair => [pal[(i >>> 4) & 0b1111], pal[(i >>> 0) & 0b1111]];

const ENTRIES = Array(256).fill(0);

/**
 * Generate 256 dither pairings for all CGA pair combinations from a given palette.
 * @param source
 * @param transforms
 */
export const generateSciDitherPairs = (
  source: Readonly<Uint32Array> | ((entry: number) => DitherPair),
  ...transforms: DitherTransform[]
): DitherPair[] => {
  const fn = typeof source === 'function' ? source : rawPairs(source);
  return transforms.reduce(
    (pairs, tx) => pairs.map(tx),
    ENTRIES.map((_, i) => fn(i)),
  );
};
