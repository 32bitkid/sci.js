import { ImageLike } from '@4bitlabs/sci0/dist/image-like';

import { s9, epx9 } from './epx';

export const scale3x = (input: ImageLike): ImageLike => {
  const output = {
    data: new Uint8ClampedArray(input.width * 3 * (input.height * 3) * 4),
    width: input.width * 3,
    height: input.height * 3,
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

  const s = Array(9);
  const p = Array(9);

  for (let iy = 0; iy < input.height; iy += 1)
    for (let ix = 0; ix < input.width; ix += 1) {
      const oOffset = ix * 3 + iy * 3 * oStride;

      s9(src, input.width, input.height, ix, iy, s);
      epx9(src, s, p);

      dst[oOffset] = src[p[0]];
      dst[oOffset + 1] = src[p[1]];
      dst[oOffset + 2] = src[p[2]];
      dst[oOffset + oStride] = src[p[3]];
      dst[oOffset + oStride + 1] = src[p[4]];
      dst[oOffset + oStride + 2] = src[p[5]];
      dst[oOffset + oStride * 2] = src[p[6]];
      dst[oOffset + oStride * 2 + 1] = src[p[7]];
      dst[oOffset + oStride * 2 + 2] = src[p[8]];
    }

  return output;
};
