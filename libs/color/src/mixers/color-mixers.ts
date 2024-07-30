import { Lab, linearRGB, okLab, sRGB, XYZ } from '@4bitlabs/color-space';
import {
  Lab_to_uint32,
  linearRGB_to_uint32,
  okLab_to_uint32,
  uint32_to_Lab,
  uint32_to_linearRGB,
  uint32_to_okLab,
  uint32_to_XYZ,
  XYZ_to_uint32,
} from '../utils/conversions';
import type { DitherPair } from '../dithers/dither-pair';
import type { MixMode } from './mix-options';

type MixFn = (a: number, b: number, bias?: number) => DitherPair;

const createMixer =
  <T>(
    inFn: (n: number) => T,
    mix: (a: T, b: T, bias: number) => T,
    outFn: (c: T) => number,
  ): MixFn =>
  (a, b, bias = 0.5) => {
    const clrA = inFn(a);
    const clrB = inFn(b);
    const [mixA, mixB] = [mix(clrA, clrB, bias), mix(clrB, clrA, bias)];
    return [outFn(mixA), outFn(mixB)];
  };

export const colorMixers: Record<MixMode, MixFn> = {
  okLab: createMixer(uint32_to_okLab, okLab.mix, okLab_to_uint32),
  'CIE-XYZ': createMixer(uint32_to_XYZ, XYZ.mix, XYZ_to_uint32),
  CIELAB: createMixer(uint32_to_Lab, Lab.mix, Lab_to_uint32),
  sRGB: createMixer(sRGB.fromUint32, sRGB.mix, sRGB.toUint32),
  'linear-RGB': createMixer(
    uint32_to_linearRGB,
    linearRGB.mix,
    linearRGB_to_uint32,
  ),
};
