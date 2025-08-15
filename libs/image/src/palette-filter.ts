import type { PaletteFilter } from './image-filter';
import type { IndexedPixelData } from './indexed-pixel-data';
import { createImageData, type ImageDataLike } from './image-data-like';

export interface PaletteFilterOptions {
  ignoreKeyColor?: true;
  backgroundColor?: number;
}

/**
 * Generates a {@link PaletteFilter} for processing 4-bit pixel data from `view`, `cursor`,
 * and `font` assets.
 *
 * @param palette
 * @param options
 *
 * @example
 *
 * ```ts
 * import { Palettes } from '@4bitlabs/color';
 * import { createPaletteFilter } from '@4bitlabs/image';
 *
 * // Generate a classic 1x1 EGA dither
 * const render = createPaletteFilter(Palettes.CGA);
 * const ouput = render(visual);
 * ```
 */
export const createPaletteFilter = (
  palette: Uint32Array,
  options: PaletteFilterOptions = {},
): PaletteFilter => {
  const { ignoreKeyColor = false, backgroundColor = false } = options;
  return function paletteFilter(
    source: IndexedPixelData,
    dest: ImageDataLike = createImageData(source.width, source.height),
  ) {
    const { keyColor } = source;
    const size = source.width * source.height;

    const output = new Uint32Array(
      dest.data.buffer,
      dest.data.byteOffset,
      dest.data.byteLength / 4,
    );

    for (let i = 0; i < size; i++) {
      const val = source.pixels[i];
      if (!ignoreKeyColor && keyColor !== undefined && val === keyColor) {
        if (backgroundColor) output[i] = backgroundColor;
        continue;
      }
      output[i] = palette[val];
    }

    return dest;
  };
};
