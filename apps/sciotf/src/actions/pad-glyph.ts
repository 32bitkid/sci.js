import type { Glyph } from '@4bitlabs/sci0';

export const padGlyph = (
  glyph: Glyph,
  padding: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  } = {},
): Glyph => {
  const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
  if (top === 0 && right === 0 && bottom === 0 && left === 0) return glyph;

  const [width, height] = [
    glyph.width + left + right,
    glyph.height + top + bottom,
  ];
  const paddedGlyph: Glyph = {
    color: glyph.color,
    height: glyph.height + top + bottom,
    keyColor: glyph.keyColor,
    pixels: new Uint8ClampedArray(width * height),
    width: glyph.width + left + right,
  };

  paddedGlyph.pixels.fill(glyph.keyColor);
  for (let y = 0; y < glyph.height; y += 1) {
    const row = glyph.pixels.subarray(y * glyph.width, (y + 1) * glyph.width);
    paddedGlyph.pixels.set(row, (y + top) * width + left);
  }

  return paddedGlyph;
};
