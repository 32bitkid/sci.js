import { ImageDataLike } from '../image-data-like';
import { epx9 } from './epx';
import { S9, s9 } from './s9';

export const scale3x = (
  input: ImageDataLike,
  output?: ImageDataLike,
): ImageDataLike => {
  output = output ?? {
    data: new Uint8ClampedArray(input.width * 3 * (input.height * 3) * 4),
    width: input.width * 3,
    height: input.height * 3,
    colorSpace: input.colorSpace,
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

  const s: S9 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const p = new Uint32Array(9);

  for (let iy = 0; iy < input.height; iy += 1)
    for (let ix = 0; ix < input.width; ix += 1) {
      const oOffset = ix * 3 + iy * 3 * oStride;

      s9(input.width, input.height, ix, iy, s);
      // prettier-ignore
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

  return output;
};
