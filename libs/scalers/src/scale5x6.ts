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
            dst[oOffset] = 0xffaaaaaa; //src[a];
            dst[oOffset + 1] = 0xff555555; //src[a];
            dst[oOffset + oStride] = 0xff555555; //src[a];
          }
          if (
            src[c] === src[b] &&
            src[b] === src[f] &&
            src[c] !== src[e] &&
            src[c] !== src[p[2]]
          ) {
            dst[oOffset + 4] = 0xffaaaaaa; //src[c];
            dst[oOffset + 3] = 0xff555555; //src[a];
            dst[oOffset + oStride + 4] = 0xff555555; //src[a];
          }
          if (
            src[g] === src[h] &&
            src[h] === src[d] &&
            src[g] !== src[e] &&
            src[g] !== src[p[6]]
          ) {
            dst[oOffset + 5 * oStride] = 0xffaaaaaa; //src[g];
            dst[oOffset + 1 + 5 * oStride] = 0xff555555; //src[a];
            dst[oOffset + 4 * oStride] = 0xff555555; //src[a];
          }
          if (
            src[i] === src[h] &&
            src[h] === src[f] &&
            src[i] !== src[e] &&
            src[i] !== src[p[8]]
          ) {
            dst[oOffset + 4 + 5 * oStride] = 0xffaaaaaa; //src[i];
            dst[oOffset + 3 + 5 * oStride] = 0xff555555; //src[a];
            dst[oOffset + 4 + 4 * oStride] = 0xff555555; //src[a];
          }
        }
      }
    }

  return output;
};
