import { uint32_to_Lab, Lab_to_uint32 } from './color-spaces/conversions';
import * as LAB from './color-spaces/lab';
import { LabColor } from './color-spaces/types';
import { deltaE } from './delta-e';
import { DitherPair } from './dither-pair';
import { DitherTransform } from './dither-transform';

const mixPair = (
  a: LabColor | number,
  b: LabColor | number,
  bias: number = 0.5,
): [number, number] => {
  const clrA = typeof a === 'number' ? uint32_to_Lab(a) : a;
  const clrB = typeof b === 'number' ? uint32_to_Lab(b) : b;
  const [mixA, mixB] = [LAB.mix(clrA, clrB, bias), LAB.mix(clrB, clrA, bias)];
  return [Lab_to_uint32(mixA), Lab_to_uint32(mixB)];
};

export const mixBy =
  (bias: number): DitherTransform =>
  ([a, b]: DitherPair) =>
    a === b ? [a, b] : mixPair(a, b, bias);

export const softMixer =
  (): DitherTransform =>
  ([a, b]) => {
    const labA = uint32_to_Lab(a);
    const labB = uint32_to_Lab(b);

    const dE = deltaE(labA, labB);

    if (dE <= 1) {
      return [
        Lab_to_uint32(LAB.lighten(labA, 0.05)),
        Lab_to_uint32(LAB.darken(labB, 0.05)),
      ];
    }

    if (dE <= 10) {
      return [a, b];
    }

    if (dE <= 20) {
      return mixPair(labA, labB, 2 / 12);
    }

    if (dE <= 75) {
      return mixPair(labA, labB, 3 / 12);
    }

    return mixPair(labA, labB, 4 / 12);
  };
