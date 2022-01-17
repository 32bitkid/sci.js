import { ImageLike } from '@4bitlabs/sci0/dist/image-like';

import { eql } from './eql';

export const scale2x = (input: ImageLike): ImageLike => {
  const [oWidth, oHeight] = [input.width << 1, input.height << 1];
  const output = {
    data: new Uint8ClampedArray((oWidth * oHeight) << 2),
    width: oWidth,
    height: oHeight,
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

  const iStride = input.width;
  const oStride = output.width;

  for (let iy = 0; iy < input.height; iy += 1)
    for (let ix = 0; ix < input.width; ix += 1) {
      const p = iy * iStride + ix;

      const a = iy - 1 >= 0 ? (iy - 1) * iStride + ix : p;
      const b = ix + 1 < input.width ? iy * iStride + (ix + 1) : p;
      const c = ix - 1 >= 0 ? iy * iStride + (ix - 1) : p;
      const d = iy + 1 < input.height ? (iy + 1) * iStride + ix : p;

      const aIsB = eql(src, a, b);
      const cIsD = eql(src, c, d);
      const aIsC = eql(src, a, c);
      const bIsD = eql(src, b, d);

      const p1 = aIsC && !cIsD && !aIsB ? a : p;
      const p2 = aIsB && !aIsC && !bIsD ? b : p;
      const p3 = cIsD && !bIsD && !aIsC ? c : p;
      const p4 = bIsD && !aIsB && !cIsD ? d : p;

      const oOffset = (ix << 1) + (iy << 1) * oStride;

      dst[oOffset] = src[p1];
      dst[oOffset + 1] = src[p2];
      dst[oOffset + oStride] = src[p3];
      dst[oOffset + 1 + oStride] = src[p4];
    }

  return output;
};
