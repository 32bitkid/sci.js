import { linearRGB } from '@4bitlabs/color-space';
import { uint32_to_linearRGB, linearRGB_to_uint32 } from './utils/conversions';
import { lerp } from './utils/lerp';
import { clamp } from './utils/clamp';

const BLACK = linearRGB.create(0, 0, 0);

// https://int10h.org/blog/2022/06/ibm-5153-color-true-cga-palette/
export function IBM5153Contrast(
  source: Readonly<Uint32Array>,
  dimmer: number,
): Uint32Array {
  const target = new Uint32Array(source);
  const mix = lerp(0.5, 0, clamp(dimmer, 0, 1));

  // Colors 1-7 are dimmed based on dimmer percentage
  for (let i = 0; i < 8; i++) {
    const color = uint32_to_linearRGB(source[i]);
    const dimmed = linearRGB.mix(color, BLACK, mix);
    target[i] = linearRGB_to_uint32(dimmed);
  }

  return target;
}
