import { type ImageDataLike, type IndexedPixelData } from '@4bitlabs/image';
import { epx9 } from './epx';
import { S9, s9 } from './s9';
import { prepareScale } from './prepare';

export const scale3x = <T extends ImageDataLike | IndexedPixelData>(
  input: T,
  output?: T,
): T => {
  const {
    dest,
    sourceRGB: src,
    destRGB: dst,
  } = prepareScale(input, [3, 3], output);

  const oStride = dest.width;

  const s: S9 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const p = new Uint32Array(9);

  for (let iy = 0; iy < input.height; iy += 1)
    for (let ix = 0; ix < input.width; ix += 1) {
      const oOffset = ix * 3 + iy * 3 * oStride;

      s9(input.width, input.height, ix, iy, s);

      // biome-ignore format: readability
      const [
        A, B, C,
        D, E, F,
        G, H, I,
      ] = epx9(src, s, p);

      dst[oOffset] = A;
      dst[oOffset + 1] = B;
      dst[oOffset + 2] = C;
      dst[oOffset + oStride] = D;
      dst[oOffset + oStride + 1] = E;
      dst[oOffset + oStride + 2] = F;
      dst[oOffset + oStride * 2] = G;
      dst[oOffset + oStride * 2 + 1] = H;
      dst[oOffset + oStride * 2 + 2] = I;
    }

  return dest;
};
