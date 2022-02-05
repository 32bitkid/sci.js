import { ImageLike } from '@4bitlabs/screen';

import { epx9, s9 } from './epx';

const PIXEL: number[] = [
  [0, 1, 1, 1, 2],
  [3, 4, 4, 4, 5],
  [3, 4, 4, 4, 5],
  [3, 4, 4, 4, 5],
  [3, 4, 4, 4, 5],
  [6, 7, 7, 7, 8],
].flat();

type RGBA = readonly [number, number, number, number];

const lerp = (v0: number, v1: number, t: number): number =>
  v0 * (1 - t) + v1 * t;

const cLerp = (c0: RGBA, c1: RGBA, t: number): RGBA => [
  lerp(c0[0], c1[0], t),
  lerp(c0[1], c1[1], t),
  lerp(c0[2], c1[2], t),
  lerp(c0[3], c1[3], t),
];

const CGA: RGBA[] = [
  [0x00, 0x00, 0x00, 0xff],
  [0x00, 0x00, 0xaa, 0xff],
  [0x00, 0xaa, 0x00, 0xff],
  [0x00, 0xaa, 0xaa, 0xff],
  [0xaa, 0x00, 0x00, 0xff],
  [0xaa, 0x00, 0xaa, 0xff],
  [0xaa, 0x55, 0x00, 0xff],
  [0xaa, 0xaa, 0xaa, 0xff],

  [0x55, 0x55, 0x55, 0xff],
  [0x55, 0x55, 0xff, 0xff],
  [0x55, 0xff, 0x55, 0xff],
  [0x55, 0xff, 0xff, 0xff],
  [0xff, 0x55, 0x55, 0xff],
  [0xff, 0x55, 0xff, 0xff],
  [0xff, 0xff, 0x55, 0xff],
  [0xff, 0xff, 0xff, 0xff],
];

const quant = (c: RGBA, allowed: RGBA[] | false): number => {
  let match = c;
  let minDist = Infinity;

  if (allowed)
    allowed.forEach((it) => {
      const aR = (c[0] + it[0]) / 2;
      const dR = Math.abs(c[0] - it[0]);
      const dG = Math.abs(c[1] - it[1]);
      const dB = Math.abs(c[2] - it[2]);

      const dist =
        (2 + aR / 256) * dR ** 2 +
        4 * dG ** 2 +
        (2 + (255 - aR) / 256) * dB ** 2;

      if (dist < minDist) {
        minDist = dist;
        match = it;
      }
    });

  const [r, g, b] = match;
  return ((r << 0) | (g << 8) | (b << 16) | (c[3] << 24)) >>> 0;
};

const rgbLerp =
  (limit: RGBA[] | false = false) =>
  (a: number, b: number, d: 0 | 1 | 1.5 | 2 | 3): number => {
    const c1 = [
      (a >>> 0) & 0xff,
      (a >>> 8) & 0xff,
      (a >>> 16) & 0xff,
      (a >>> 24) & 0xff,
    ] as const;

    const c2 = [
      (b >>> 0) & 0xff,
      (b >>> 8) & 0xff,
      (b >>> 16) & 0xff,
      (b >>> 24) & 0xff,
    ] as const;

    return quant(cLerp(c1, c2, d / 3), limit);
  };

interface Scale5x6Options {
  shave?: boolean;
  limit?: RGBA[] | false;
}

export const scale5x6 = (
  input: ImageLike,
  options: Scale5x6Options = {},
): ImageLike => {
  const { shave = false, limit = CGA } = options;

  const clrLerp = rgbLerp(limit);

  const output = {
    data: new Uint8ClampedArray(input.width * 5 * (input.height * 6) * 4),
    width: input.width * 5,
    height: input.height * 6,
  };

  const src = new Uint32Array(
    input.data.buffer,
    input.data.byteOffset,
    input.data.byteLength >>> 2,
  );

  const dst = new Uint32Array(
    output.data.buffer,
    output.data.byteOffset,
    output.data.byteLength >>> 2,
  );

  const oStride = output.width;

  const s = Array<number>(9);
  const p = Array<number>(9);

  for (let iy = 0; iy < input.height; iy += 1)
    for (let ix = 0; ix < input.width; ix += 1) {
      const base = ix * 5 + iy * 6 * oStride;

      s9(src, input.width, input.height, ix, iy, s);
      epx9(src, s, p);

      for (let oy = 0; oy < 6; oy++)
        for (let ox = 0; ox < 5; ox++) {
          const pIdx = PIXEL[oy * 5 + ox];
          dst[base + ox + oy * oStride] = src[p[pIdx]];
        }

      const [a, b, c, d, e, f, g, h, i] = s;

      if (!shave) continue;
      //┌
      if (
        src[a] === src[b] &&
        src[b] === src[d] &&
        src[a] !== src[e] &&
        src[a] !== src[p[0]]
      ) {
        dst[base] = clrLerp(src[a], src[p[0]], 0);
        dst[base + 1] = clrLerp(src[a], src[p[0]], 2);
        dst[base + oStride] = clrLerp(src[a], src[p[0]], 1);
      }

      // ┐
      if (
        src[c] === src[b] &&
        src[b] === src[f] &&
        src[c] !== src[e] &&
        src[c] !== src[p[2]]
      ) {
        dst[base + 4] = clrLerp(src[c], src[p[2]], 0);
        dst[base + 3] = clrLerp(src[c], src[p[2]], 2);
        dst[base + oStride + 4] = clrLerp(src[c], src[p[2]], 1);
      }

      // └
      if (
        src[g] === src[h] &&
        src[h] === src[d] &&
        src[g] !== src[e] &&
        src[g] !== src[p[6]]
      ) {
        dst[base + 5 * oStride] = clrLerp(src[g], src[p[6]], 0);
        dst[base + 1 + 5 * oStride] = clrLerp(src[g], src[p[6]], 2);
        dst[base + 4 * oStride] = clrLerp(src[g], src[p[6]], 1);
      }

      // ┘
      if (
        src[i] === src[h] &&
        src[h] === src[f] &&
        src[i] !== src[e] &&
        src[i] !== src[p[8]]
      ) {
        dst[base + 4 + 5 * oStride] = clrLerp(src[i], src[p[8]], 0);
        dst[base + 3 + 5 * oStride] = clrLerp(src[i], src[p[8]], 2);
        dst[base + 4 + 4 * oStride] = clrLerp(src[i], src[p[8]], 1);
      }

      [
        // 012
        // 345
        // 678
        [1, 5, 2, 3, 4 + oStride],
        [5, 7, 8, 3 + oStride * 5, 4 + oStride * 4],
        [7, 3, 6, 1 + oStride * 5, oStride * 4],
        [3, 1, 0, 1, oStride],
      ].forEach(([e0, e1, c0, ...rest]) => {
        if (src[p[e0]] === src[p[e1]] && src[p[c0]] !== src[p[e0]]) {
          const mix = clrLerp(src[p[c0]], src[p[e0]], 1);
          rest.forEach((d) => (dst[base + d] = mix));
        }
      });
    }

  return output;
};
