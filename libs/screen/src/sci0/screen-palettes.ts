import { Colord, colord, extend as colordExtend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

import { EGA_PALETTE as EGA } from '../common';

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
  a: number,
  b: number,
  bias: [number, number] = [0.5, 0.5],
): [number, number] => {
  const clrA = colorFromUint32(a);
  const clrB = colorFromUint32(b);

  const mixA = clrA.mix(clrB, bias[0]);
  const mixB = clrA.mix(clrB, bias[1]);

  const ma = uint32FromColor(mixA);
  const mb = uint32FromColor(mixB);

  return [ma, mb];
};

type DitherPair = [number, number];

const CLASSIC: DitherPair[] = Array(256)
  .fill(0)
  .map((_, i) => [EGA[(i >>> 4) & 0b1111], EGA[(i >>> 0) & 0b1111]]);

const MIX: DitherPair[] = CLASSIC.map(([a, b]) => mixPair(a, b));

const SOFT: DitherPair[] = CLASSIC.map(([a, b]) => {
  if (a === b) {
    const base = colorFromUint32(a);

    return [
      uint32FromColor(base.lighten(0.01)),
      uint32FromColor(base.darken(0.01)),
    ];
  }

  return mixPair(a, b, [4 / 12, 8 / 12]);
});

export { CLASSIC, MIX, SOFT };
