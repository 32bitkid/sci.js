import { Colord, colord, extend as colordExtend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import { deltaE } from './delta-e';
import { DitherPair } from './dither-pair';
import { DitherTransform } from './dither-transform';

colordExtend([mixPlugin]);

export const abgrToColor = (c: number): Colord =>
  colord({
    r: (c >>> 0) & 0xff,
    g: (c >>> 8) & 0xff,
    b: (c >>> 16) & 0xff,
    a: ((c >>> 24) & 0xff) / 255,
  });

export const colorToAbgr = (c: Colord) =>
  0xff000000 | (c.rgba.b << 16) | (c.rgba.g << 8) | (c.rgba.r << 0);

const mixPair = (
  a: number | Colord,
  b: number | Colord,
  bias: number = 0.5,
): [number, number] => {
  const clrA = typeof a === 'number' ? abgrToColor(a) : a;
  const clrB = typeof b === 'number' ? abgrToColor(b) : b;

  const mixA = clrA.mix(clrB, bias);
  const mixB = clrB.mix(clrA, bias);

  const ma = colorToAbgr(mixA);
  const mb = colorToAbgr(mixB);

  return [ma, mb];
};

export const mixBy =
  (bias: number): DitherTransform =>
  ([a, b]: DitherPair) =>
    a === b ? [a, b] : mixPair(a, b, bias);

export interface SoftMixerOptions {}

export const softMixer =
  (options: SoftMixerOptions = {}): DitherTransform =>
  ([a, b]) => {
    const clrA = abgrToColor(a);
    const clrB = abgrToColor(b);

    const dE = deltaE(clrA.rgba, clrB.rgba);

    if (dE <= 1) {
      const mod = Math.min(0.1, Math.abs(clrA.brightness() - 0.5) * 2) * 0.25;
      return [colorToAbgr(clrA.lighten(mod)), colorToAbgr(clrB.darken(mod))];
    }

    if (dE <= 10) {
      return [a, b];
    }

    if (dE <= 20) {
      return mixPair(clrA, clrB, 2 / 12);
    }

    if (dE <= 75) {
      return mixPair(clrA, clrB, 3 / 12);
    }

    return mixPair(clrA, clrB, 4 / 12);
  };
