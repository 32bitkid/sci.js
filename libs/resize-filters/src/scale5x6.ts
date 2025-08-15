import { type ImageDataLike, type IndexedPixelData } from '@4bitlabs/image';
import { epx9sfx } from './epx';
import { S13, s13 } from './s9';
import { prepareScale } from './prepare';

const s: S13 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const scale5x6 = <T extends ImageDataLike | IndexedPixelData>(
  input: T,
  output?: T,
): T => {
  const {
    dest,
    sourceRGB: src,
    destRGB: dst,
  } = prepareScale(input, [5, 6], output);

  const oStride = dest.width;

  const p = new Uint32Array(9);

  for (let iy = 0; iy < input.height; iy += 1)
    for (let ix = 0; ix < input.width; ix += 1) {
      const oOffset = ix * 5 + iy * 6 * oStride;

      s13(input.width, input.height, ix, iy, s);

      // biome-ignore format: readability
      const [
        A, B, C,
        D, E, F,
        G, H, I,
      ] = epx9sfx(src, s, p);

      dst[oOffset] = A;
      dst[oOffset + 1] = B;
      dst[oOffset + 2] = B;
      dst[oOffset + 3] = B;
      dst[oOffset + 4] = C;

      dst[oOffset + oStride] = A;
      dst[oOffset + 1 + oStride] = E;
      dst[oOffset + 2 + oStride] = E;
      dst[oOffset + 3 + oStride] = E;
      dst[oOffset + 4 + oStride] = C;

      dst[oOffset + oStride * 2] = D;
      dst[oOffset + 1 + oStride * 2] = E;
      dst[oOffset + 2 + oStride * 2] = E;
      dst[oOffset + 3 + oStride * 2] = E;
      dst[oOffset + 4 + oStride * 2] = F;

      dst[oOffset + oStride * 3] = D;
      dst[oOffset + 1 + oStride * 3] = E;
      dst[oOffset + 2 + oStride * 3] = E;
      dst[oOffset + 3 + oStride * 3] = E;
      dst[oOffset + 4 + oStride * 3] = F;

      dst[oOffset + oStride * 4] = G;
      dst[oOffset + 1 + oStride * 4] = E;
      dst[oOffset + 2 + oStride * 4] = E;
      dst[oOffset + 3 + oStride * 4] = E;
      dst[oOffset + 4 + oStride * 4] = I;

      dst[oOffset + oStride * 5] = G;
      dst[oOffset + 1 + oStride * 5] = H;
      dst[oOffset + 2 + oStride * 5] = H;
      dst[oOffset + 3 + oStride * 5] = H;
      dst[oOffset + 4 + oStride * 5] = I;
    }

  return dest;
};
