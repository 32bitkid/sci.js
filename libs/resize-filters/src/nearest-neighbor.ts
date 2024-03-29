import { ImageDataLike, IndexedPixelData } from '@4bitlabs/image';
import { type ImageResizer } from './image-resizer';
import { prepareScale } from './prepare';

export function nearestNeighbor(ratio: [number, number]): ImageResizer {
  const [sx, sy] = [ratio[0] >>> 0, ratio[1] >>> 0];

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

    const width = iWidth * sx;

    for (let y = 0; y < iHeight; y++) {
      const oIdx = y * sy * width;
      const row = outP.subarray(oIdx, oIdx + width);

      // fill the next row
      for (let x = 0; x < width; x++) {
        const ix = (x / sx) >>> 0;
        row[x] = inP[ix + y * iWidth];
      }

      // copy row n - 1 times
      for (let i = 1; i < sy; i++) {
        outP.set(row, oIdx + i * width);
      }
    }

    return dest;
  }

  return scale;
}
