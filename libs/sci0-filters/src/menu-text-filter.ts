import type { FontFace } from '@4bitlabs/sci0';
import { createIndexedPixelData, PixelFilter } from '@4bitlabs/image';

export interface MenuTextFilterOptions {
  font: FontFace;
  left?: string;
  right?: string;
}

export const menuTextFilter = (
  ox: number,
  oy: number,
  options: MenuTextFilterOptions,
): PixelFilter => {
  const { font, left = '', right = '' } = options;

  return (it) => {
    const output = createIndexedPixelData(it.width, it.height + 10);
    output.pixels.set(it.pixels, it.width * 10);
    for (let i = 0; i < it.width * 10; i++) {
      output.pixels[i] = 0xff;
    }
    left.split('').reduce(($x, ch) => {
      const glyph = font.characters[ch.charCodeAt(0)];
      for (let y = 0; y < glyph.height; y++)
        for (let x = 0; x < glyph.width; x++) {
          if (glyph.pixels[y * glyph.width + x])
            output.pixels[(y + oy) * it.width + ($x + x + ox)] = 0x00;
        }
      return $x + glyph.width;
    }, 0);

    `${right} \u0001`
      .split('')
      .reverse()
      .reduce(($x, ch) => {
        const glyph = font.characters[ch.charCodeAt(0)];
        for (let y = 0; y < glyph.height; y++)
          for (let x = 0; x < glyph.width; x++) {
            if (glyph.pixels[y * glyph.width + x])
              output.pixels[
                (y + oy) * it.width + (it.width - $x - glyph.width - ox + x)
              ] = 0x00;
          }
        return $x + glyph.width;
      }, 0);

    return output;
  };
};
