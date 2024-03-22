import { type ImageDataLike } from '../image-data-like';
import { IndexedPixelData } from '../indexed-pixel-data';
import { prepareScale } from './prepare';

export const scale2x = <T extends ImageDataLike | IndexedPixelData>(
  input: T,
  output?: T,
): T => {
  const {
    source,
    dest,
    sourceRGB: src,
    destRGB: dst,
  } = prepareScale(input, [2, 2], output);

  const iStride = source.width;
  const oStride = dest.width;

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

  return dest;
};
