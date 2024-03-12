import { epx9sfx } from './epx';
import { ImageDataLike } from './image-data-like';
import { S13, s13 } from './s9';

const s: S13 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const scale5x6 = (
  input: ImageDataLike,
  output?: ImageDataLike,
): ImageDataLike => {
  output = output ?? {
    data: new Uint8ClampedArray(input.width * 5 * (input.height * 6) * 4),
    width: input.width * 5,
    height: input.height * 6,
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

  const p = new Uint32Array(9);

  for (let iy = 0; iy < input.height; iy += 1)
    for (let ix = 0; ix < input.width; ix += 1) {
      const oOffset = ix * 5 + iy * 6 * oStride;

      s13(input.width, input.height, ix, iy, s);

      // prettier-ignore
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

  return output;
};
