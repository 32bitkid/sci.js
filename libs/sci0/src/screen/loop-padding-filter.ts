import { createIndexedPixelData, IndexedPixelData } from '@4bitlabs/image';
import { type Loop } from '../models/view';
import { type Cel } from '../models/cel';

export const loopPaddingFilter = (loop: Loop) => {
  const { isMirrored, bounds } = loop;
  const { left, top, right, width: loopWidth, height: loopHeight } = bounds;

  return (source: IndexedPixelData | Cel): IndexedPixelData => {
    if (!('dx' in source)) {
      return source;
    }

    const dest = createIndexedPixelData(loopWidth, loopHeight, {
      keyColor: source.keyColor,
    });

    const sStride = source.width;
    const dStride = dest.width;

    for (let ySource = 0; ySource < source.height; ySource++) {
      const yDest = source.dy - top - source.height + ySource;

      for (let xSource = 0; xSource < source.width; xSource++) {
        const xActual = isMirrored ? source.width - xSource - 1 : xSource;

        const edge = isMirrored
          ? +right - source.dx - (source.width & 0b1)
          : -left + source.dx;
        const xDest = xSource - (source.width >>> 1) + edge;

        const destIdx = yDest * dStride + xDest;
        const sourceIdx = ySource * sStride + xActual;
        dest.pixels[destIdx] = source.pixels[sourceIdx];
      }
    }

    return dest;
  };
};
