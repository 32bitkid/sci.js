import { abgrToColor, colorToAbgr } from './mixers';

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(val, max));

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

// https://int10h.org/blog/2022/06/ibm-5153-color-true-cga-palette/
export function IBM5153Dimmer(
  source: Uint32Array,
  dimmer: number,
): Uint32Array {
  const target = new Uint32Array(source);
  const black = abgrToColor(source[0]);

  const mix = lerp(0.65, 0, clamp(dimmer, 0, 1));

  // Colors 1-7 are dimmed based on dimmer percentage
  for (let i = 1; i < 8; i++) {
    const clr = abgrToColor(source[i]);
    const dimmed = clr.mix(black, mix);
    target[i] = colorToAbgr(dimmed);
  }

  return target;
}
