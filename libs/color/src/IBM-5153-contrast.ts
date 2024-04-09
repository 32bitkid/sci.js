import { Lab } from '@4bitlabs/color-space';
import { uint32_to_Lab, Lab_to_uint32 } from './utils/conversions';
import { lerp } from './utils/lerp';
import { clamp } from './utils/clamp';

// https://int10h.org/blog/2022/06/ibm-5153-color-true-cga-palette/
export function IBM5153Contrast(
  source: Uint32Array,
  dimmer: number,
): Uint32Array {
  const target = new Uint32Array(source);
  const mix = lerp(0.5, 0, clamp(dimmer, 0, 1));

  // Colors 1-7 are dimmed based on dimmer percentage
  for (let i = 0; i < 8; i++) {
    const color = uint32_to_Lab(source[i]);
    const dimmed = Lab.darken(color, mix);
    source[i] = Lab_to_uint32(dimmed);
  }

  return target;
}
