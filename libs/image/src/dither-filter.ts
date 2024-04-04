import { DitherPair } from '@4bitlabs/color';
import { ImageDataLike, createImageData } from './image-data-like';
import { IndexedPixelData } from './indexed-pixel-data';
import { type PaletteFilter } from './image-filter';

export const createDitherFilter = (
  pal: DitherPair[],
  ditherSize: [number, number] = [1, 1],
): PaletteFilter =>
  function ditherFilter(
    source: IndexedPixelData,
    dest: ImageDataLike = createImageData(source.width, source.height),
  ): ImageDataLike {
    const inData = source.pixels;
    // const inAlpha = source.alpha;
    const outData = new Uint32Array(
      dest.data.buffer,
      dest.data.byteOffset,
      dest.data.byteLength >> 2,
    );

    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        const idx = x + y * source.width;
        const src = inData[idx];

        const dx = (x / ditherSize[0]) & 1;
        const dy = (y / ditherSize[1]) & 1;
        const dither = dx ^ dy;

        outData[idx] = pal[src & 0xff][dither ? 0 : 1];
      }
    }

    return dest;
  };
