import type { ImageDataLike, IndexedPixelData } from '@4bitlabs/image';
import type { ImageResizer } from './image-resizer.js';
import { prepareScale } from './prepare.js';

export function nearestNeighbor(ratio: [number, number]): ImageResizer {
  const [sx, sy] = [Math.max(0, ratio[0]), Math.max(0, ratio[1])];

  function scale(input: ImageDataLike, output?: ImageDataLike): ImageDataLike;
  function scale(
    input: IndexedPixelData,
    output?: IndexedPixelData,
  ): IndexedPixelData;
  function scale<T extends ImageDataLike | IndexedPixelData>(
    input: T,
    output?: T,
  ): T {
    const {
      source,
      dest,
      sourceRGB: inP,
      destRGB: outP,
    } = prepareScale(input, ratio, output);
    const { width: iWidth, height: iHeight } = source;

    if (Number.isInteger(sx) && Number.isInteger(sy)) {
      const width = iWidth * sx;

      for (let y = 0; y < iHeight; y++) {
        const oIdx = y * sy * width;

        // fill the next row
        for (let x = 0; x < width; x++) {
          const ix = (x / sx) >>> 0;
          outP[oIdx + x] = inP[ix + y * iWidth];
        }

        // copy row n - 1 times
        for (let i = 1; i < sy; i++) {
          outP.copyWithin(oIdx + i * width, oIdx, oIdx + width);
        }
      }
    } else {
      for (let oy = 0; oy < dest.height; oy++) {
        for (let ox = 0; ox < dest.width; ox++) {
          const ix = Math.round(ox * (source.width / dest.width));
          const iy = Math.round(oy * (source.height / dest.height));
          const iIdx = ix + iy * source.width;
          const oIdx = ox + oy * dest.width;
          outP[oIdx] = inP[iIdx];
        }
      }
    }

    return dest;
  }

  return scale;
}
