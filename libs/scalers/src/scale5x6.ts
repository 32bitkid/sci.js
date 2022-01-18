import { ImageLike } from '@4bitlabs/sci0/dist/image-like';

import { epx9, s9 } from './epx';

const PIXEL = [
  [0, 0, 1, 2, 2],
  [0, 0, 1, 2, 2],
  [3, 3, 4, 5, 5],
  [3, 3, 4, 5, 5],
  [6, 6, 7, 8, 8],
  [6, 6, 7, 8, 8],
].flat();

const lerp = (v0: number, v1: number, t: number): number =>
  v0 * (1 - t) + v1 * t;

const cgaQuant = (r: number, g: number, b: number, a: number): number => {
  r = Math.round(r / 0x55) * 0x55;
  g = Math.round(g / 0x55) * 0x55;
  b = Math.round(b / 0x55) * 0x55;

  if (r === 0xaa && g === 0xaa && b === 0x00) g = 0x55;
  return ((r << 16) | (g << 8) | b | (a << 24)) >>> 0;
};

const cgaLerp = (c1: number, c2: number, d: 0 | 1 | 2 | 3): number => {
  const [r1, g1, b1, a1] = [
    (c1 >>> 16) & 0xff,
    (c1 >>> 8) & 0xff,
    (c1 >>> 0) & 0xff,
    (c1 >>> 24) & 0xff,
  ];

  const [r2, g2, b2, a2] = [
    (c2 >>> 16) & 0xff,
    (c2 >>> 8) & 0xff,
    (c2 >>> 0) & 0xff,
    (c2 >>> 24) & 0xff,
  ];

  const r = lerp(r1, r2, d / 3) >>> 0;
  const g = lerp(g1, g2, d / 3) >>> 0;
  const b = lerp(b1, b2, d / 3) >>> 0;
  const a = lerp(a1, a2, d / 3) >>> 0;
  return cgaQuant(r, g, b, a);
};

export const scale5x6 = (input: ImageLike, shave = false): ImageLike => {
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
      const oOffset = ix * 5 + iy * 6 * oStride;

      s9(src, input.width, input.height, ix, iy, s);
      epx9(src, s, p);

      for (let oy = 0; oy < 6; oy++)
        for (let ox = 0; ox < 5; ox++) {
          const pIdx = PIXEL[oy * 5 + ox];
          dst[oOffset + ox + oy * oStride] = src[p[pIdx]];
        }

      const [a, b, c, d, e, f, g, h, i] = s;
      {
        if (shave) {
          if (
            src[a] === src[b] &&
            src[b] === src[d] &&
            src[a] !== src[e] &&
            src[a] !== src[p[0]]
          ) {
            dst[oOffset] = cgaLerp(src[a], src[p[0]], 1);
            dst[oOffset + 1] = cgaLerp(src[a], src[p[0]], 2);
            dst[oOffset + oStride] = cgaLerp(src[a], src[p[0]], 2);
          }
          if (
            src[c] === src[b] &&
            src[b] === src[f] &&
            src[c] !== src[e] &&
            src[c] !== src[p[2]]
          ) {
            dst[oOffset + 4] = cgaLerp(src[c], src[p[2]], 1);
            dst[oOffset + 3] = cgaLerp(src[c], src[p[2]], 2);
            dst[oOffset + oStride + 4] = cgaLerp(src[c], src[p[2]], 2);
          }
          if (
            src[g] === src[h] &&
            src[h] === src[d] &&
            src[g] !== src[e] &&
            src[g] !== src[p[6]]
          ) {
            dst[oOffset + 5 * oStride] = cgaLerp(src[g], src[p[6]], 1);
            dst[oOffset + 1 + 5 * oStride] = cgaLerp(src[g], src[p[6]], 2);
            dst[oOffset + 4 * oStride] = cgaLerp(src[g], src[p[6]], 2);
          }
          if (
            src[i] === src[h] &&
            src[h] === src[f] &&
            src[i] !== src[e] &&
            src[i] !== src[p[8]]
          ) {
            dst[oOffset + 4 + 5 * oStride] = cgaLerp(src[i], src[p[8]], 1);
            dst[oOffset + 3 + 5 * oStride] = cgaLerp(src[i], src[p[8]], 2);
            dst[oOffset + 4 + 4 * oStride] = cgaLerp(src[i], src[p[8]], 2);
          }
        }
      }
    }

  return output;
};
