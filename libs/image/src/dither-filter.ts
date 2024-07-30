import { DitherPair } from '@4bitlabs/color/dithers';
import { ImageDataLike, createImageData } from './image-data-like';
import { IndexedPixelData } from './indexed-pixel-data';
import { type PaletteFilter } from './image-filter';

/**
 * Generates a {@link PaletteFilter} for processing 8-bit dither-pairs from raw render data
 * of `visual` layer SCI-engine PIC assets into 4-bit dithered images.
 *
 * @param pal 256 dither-pairs.
 * @param ditherSize Dithering size, in pixels. Defaults to 1&times;1 pixel dither.
 *
 * @example
 * ```ts
 * import { Dithers } from '@4bitlabs/color';
 * import { createDitherFilter } from '@4bitlabs/image';
 *
 * // Generate a classic 1x1 EGA dither
 * const dither = createDitherFilter(Dithers.CGA);
 * const ouput = dither(visual);
 * ```
 */
export const createDitherFilter = (
  pal: DitherPair[],
  ditherSize: [number, number] = [1, 1],
): PaletteFilter =>
  function ditherFilter(
    source: IndexedPixelData,
    dest: ImageDataLike = createImageData(source.width, source.height),
  ): ImageDataLike {
    const inData = source.pixels;
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

        outData[idx] = pal[src][dither ? 0 : 1];
      }
    }

    return dest;
  };
