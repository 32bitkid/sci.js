import { sRGB, Lab, okLab, XYZ, linearRGB } from '@4bitlabs/color-space';
import {
  Lab_to_uint32,
  XYZ_to_uint32,
  linearRGB_to_uint32,
  okLab_to_uint32,
  uint32_to_Lab,
  uint32_to_XYZ,
  uint32_to_linearRGB,
  uint32_to_okLab,
} from './utils/conversions';
import { DitherPair } from './dither-pair';
import { DitherTransform } from './dither-transform';

const createMixer =
  <T>(
    inFn: (n: number) => T,
    mix: (a: T, b: T, bias: number) => T,
    outFn: (c: T) => number,
  ) =>
  (a: number, b: number, bias: number = 0.5): [number, number] => {
    const clrA = inFn(a);
    const clrB = inFn(b);
    const [mixA, mixB] = [mix(clrA, clrB, bias), mix(clrB, clrA, bias)];
    return [outFn(mixA), outFn(mixB)];
  };

const colorMixers = {
  okLab: createMixer(uint32_to_okLab, okLab.mix, okLab_to_uint32),
  'CIE-XYZ': createMixer(uint32_to_XYZ, XYZ.mix, XYZ_to_uint32),
  CIELAB: createMixer(uint32_to_Lab, Lab.mix, Lab_to_uint32),
  sRGB: createMixer(sRGB.fromUint32, sRGB.mix, sRGB.toUint32),
  'linear-RGB': createMixer(
    uint32_to_linearRGB,
    linearRGB.mix,
    linearRGB_to_uint32,
  ),
} as const;

export interface MixOptions {
  mixMode?: 'okLab' | 'CIE-XYZ' | 'CIELAB' | 'sRGB' | 'linear-RGB';
}

const defaultMixMode: keyof typeof colorMixers = 'linear-RGB';

export const mixBy = (
  bias: number,
  options: MixOptions = {},
): DitherTransform => {
  const { mixMode = defaultMixMode } = options;
  const mixPair = colorMixers[mixMode];

  return ([a, b]: DitherPair) => (a === b ? [a, b] : mixPair(a, b, bias));
};

export const softMixer = (options: MixOptions = {}): DitherTransform => {
  const { mixMode = defaultMixMode } = options;
  const mixPair = colorMixers[mixMode];

  return ([a, b]) => {
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
