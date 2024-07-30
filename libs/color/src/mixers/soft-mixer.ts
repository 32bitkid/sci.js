import { Lab } from '@4bitlabs/color-space';
import { Lab_to_uint32, uint32_to_Lab } from '../utils/conversions';
import type { DitherPair } from '../dithers/dither-pair';
import type { DitherTransform } from '../dithers/dither-transform';
import type { MixOptions } from './mix-options';
import { colorMixers } from './color-mixers';

/**
 * Create a {@link DitherTransform} that dynamically blends two colors, based on their perceptual difference.
 * @param options
 */
export const softMixer = (options: MixOptions = {}): DitherTransform => {
  const { mixMode = 'linear-RGB' } = options;
  const mixPair = colorMixers[mixMode];

  return ([a, b]: Readonly<DitherPair>) => {
    const labA = uint32_to_Lab(a);
    const labB = uint32_to_Lab(b);

    const dE = Lab.deltaE(labA, labB);

    if (dE <= 1) {
      return [
        Lab_to_uint32(Lab.lighten(labA, 0.05)),
        Lab_to_uint32(Lab.darken(labB, 0.05)),
      ];
    }

    if (dE <= 10) {
      return [a, b];
    }

    if (dE <= 20) {
      return mixPair(a, b, 2 / 12);
    }

    if (dE <= 75) {
      return mixPair(a, b, 3 / 12);
    }

    return mixPair(a, b, 4 / 12);
  };
};
