import type { MixOptions } from './mix-options';
import type { DitherTransform } from '../dithers/dither-transform';
import { colorMixers } from './color-mixers';
import type { DitherPair } from '../dithers/dither-pair';

/**
 * Create a {@link DitherTransform} that blends two colors by a constant factor, `bias`.
 * @param bias The factor to mix. 0 = no blending. 0.5 = even blending
 * @param options
 */
export const mixBy = (
  bias: number,
  options: MixOptions = {},
): DitherTransform => {
  const { mixMode = 'linear-RGB' } = options;
  const mixPair = colorMixers[mixMode];

  return ([a, b]: Readonly<DitherPair>) =>
    a === b ? [a, b] : mixPair(a, b, bias);
};
