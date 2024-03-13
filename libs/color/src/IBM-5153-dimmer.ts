const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(val, max));

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

// https://int10h.org/blog/2022/06/ibm-5153-color-true-cga-palette/
export function IBM5153Dimmer(
  source: Uint32Array,
  dimmer: number,
): Uint32Array {
  const target = new Uint32Array(source);
  const mix = 1 - lerp(0.42, 0, clamp(dimmer, 0, 1));

  // Colors 1-7 are dimmed based on dimmer percentage
  for (let i = 0; i < 8; i++) {
    const c = source[i];
    const r = ((c >>> 0) & 0xff) * mix;
    const g = ((c >>> 8) & 0xff) * mix;
    const b = ((c >>> 16) & 0xff) * mix;
    const a = (c >>> 24) & 0xff;
    target[i] = (a << 24) | (b << 16) | (g << 8) | (r << 0);
  }

  return target;
}
