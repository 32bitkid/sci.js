import { PaletteFilter } from './image-filter';
import { IndexedPixelData } from './indexed-pixel-data';
import { createImageData, ImageDataLike } from './image-data-like';

interface PaletteFilterOptions {
  ignoreKeyColor?: true;
}

export const createPaletteFilter = (
  palette: Uint32Array,
  options: PaletteFilterOptions = {},
): PaletteFilter => {
  const { ignoreKeyColor = false } = options;
  return function paletteFilter(
    source: IndexedPixelData,
    dest: ImageDataLike = createImageData(source.width, source.height),
  ) {
    const { keyColor } = source;
    const size = source.width * source.height;

    const output = new Uint32Array(
      dest.data,
      dest.data.byteOffset,
      dest.data.byteLength / 4,
    );

    for (let i = 0; i < size; i++) {
      const val = source.pixels[i];
      if (!ignoreKeyColor && keyColor !== undefined && val === keyColor)
        continue;

      output[i] = palette[val];
    }

    return dest;
  };
};
