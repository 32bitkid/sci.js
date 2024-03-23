import { ImageDataLike, IndexedPixelData } from '@4bitlabs/image';
import { type ImageResizer } from './image-resizer';
import { prepareScale } from './prepare';

export function nearestNeighbor(ratio: [number, number]): ImageResizer {
  function scale(input: ImageDataLike, output?: ImageDataLike): ImageDataLike;
  function scale(
    input: IndexedPixelData,
    output?: IndexedPixelData,
  ): IndexedPixelData;
  function scale<T extends ImageDataLike | IndexedPixelData>(
    input: T,
    output?: T,
  ): T {
    const [sx, sy] = ratio;

    const {
      source,
      dest,
      sourceRGB: inP,
      destRGB: outP,
    } = prepareScale(input, ratio, output);
    const { width: iWidth, height: iHeight } = source;

    const width = iWidth * sx;
    const height = iHeight * sy;

    for (let y = 0; y < height; y++) {
      const iy = (y / sy) >>> 0;
      for (let x = 0; x < width; x++) {
        const ix = (x / sx) >>> 0;
        outP[x + y * width] = inP[ix + iy * iWidth];
      }
    }

    return dest;
  }

  return scale;
}
