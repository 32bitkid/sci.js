import { Colord, colord, extend as colordExtend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

import { redMeanDiff } from './red-mean-diff';

colordExtend([mixPlugin]);

const colorFromUint32 = (c: number): Colord =>
  colord({
    r: (c >>> 0) & 0xff,
    g: (c >>> 8) & 0xff,
    b: (c >>> 16) & 0xff,
    a: ((c >>> 24) & 0xff) / 255,
  });

const uint32FromColor = (c: Colord) =>
  0xff000000 | (c.rgba.b << 16) | (c.rgba.g << 8) | (c.rgba.r << 0);

const mixPair = (
  a: number | Colord,
  b: number | Colord,
  bias: number = 0.5,
): [number, number] => {
  const clrA = typeof a === 'number' ? colorFromUint32(a) : a;
  const clrB = typeof b === 'number' ? colorFromUint32(b) : b;

  const mixA = clrA.mix(clrB, bias);
  const mixB = clrA.mix(clrB, 1 - bias);

  const ma = uint32FromColor(mixA);
  const mb = uint32FromColor(mixB);

  return [ma, mb];
};

export type DitherPair = [number, number];
export type DitherTransform = (pair: DitherPair) => DitherPair;

export const mixBy =
  (bias: number): DitherTransform =>
  ([a, b]: DitherPair) =>
    a === b ? [a, b] : mixPair(a, b, bias);

export const softMixer: DitherTransform = ([a, b]) => {
  const clrA = colorFromUint32(a);
  const clrB = colorFromUint32(b);

  if (a === b) {
    const mod = Math.min(0.1, Math.abs(clrA.brightness() - 0.5) * 2) * 0.25;
    return [
      uint32FromColor(clrA.lighten(mod)),
      uint32FromColor(clrA.darken(mod)),
    ];
  }

  const diff = Math.abs(clrA.brightness() - clrB.brightness());

  if (Math.sqrt(redMeanDiff(clrA.rgba, clrB.rgba)) >= 650)
    return mixPair(clrA, clrB, 5.5 / 12);

  if (diff >= 0.35) return mixPair(clrA, clrB, 5 / 12);
  if (diff >= 0.15) return mixPair(clrA, clrB, 4 / 12);

  if (diff >= 0.075) return mixPair(clrA, clrB, 3 / 12);
  if (diff >= 0.02) return mixPair(clrA, clrB, 2 / 12);

  return [a, b];
};
