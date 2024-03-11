import { ImageDataLike } from './image-data-like';

export const scale2x = (
  input: ImageDataLike,
  output?: ImageDataLike,
): ImageDataLike => {
  const [oWidth, oHeight] = [input.width * 2, input.height * 2];
  output = output ?? {
    data: new Uint8ClampedArray(oWidth * oHeight * 4),
    width: oWidth,
    height: oHeight,
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

  const iStride = input.width;
  const oStride = output.width;

  for (let iy = 0; iy < input.height; iy += 1)
    for (let ix = 0; ix < input.width; ix += 1) {
      const p = iy * iStride + ix;

      const a = iy - 1 >= 0 ? p - iStride : p;
      const b = ix + 1 < input.width ? p + 1 : p;
      const c = ix - 1 >= 0 ? p - 1 : p;
      const d = iy + 1 < input.height ? p + iStride : p;

      const [p1, p2, p3, p4] =
        src[a] !== src[d] && src[b] !== src[c]
          ? [
              src[a] === src[c] ? a : p,
              src[a] === src[b] ? b : p,
              src[c] === src[d] ? c : p,
              src[b] === src[d] ? d : p,
            ]
          : [p, p, p, p];

      const oOffset = (ix << 1) + (iy << 1) * oStride;
      dst[oOffset] = src[p1];
      dst[oOffset + 1] = src[p2];
      dst[oOffset + oStride] = src[p3];
      dst[oOffset + 1 + oStride] = src[p4];
    }

  return output;
};
