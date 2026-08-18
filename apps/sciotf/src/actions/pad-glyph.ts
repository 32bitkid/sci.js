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

export const sumShifts = (
  ...shifts: ({ dx?: number; dy?: number } | undefined)[]
): { dx: number; dy: number } =>
  shifts.reduce<{ dx: number; dy: number }>(
    (prev, next = {}) => ({
      dx: prev.dx + (next.dx ?? 0),
      dy: prev.dy + (next.dy ?? 0),
    }),
    { dx: 0, dy: 0 },
  );

export const shiftGlyph = (
  glyph: Glyph,
  shift: { dx?: number; dy?: number } = {},
) => {
  const { dx = 0, dy = 0 } = shift;
  if (dx === 0 && dy === 0) return glyph;

  const { width, height } = glyph;

  const paddedGlyph: Glyph = {
    color: glyph.color,
    height: height,
    keyColor: glyph.keyColor,
    pixels: new Uint8ClampedArray(width * height),
    width: width,
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [inX, inY] = [x - dx, y - dy];
      const [inIdx, outIdx] = [inY * width + inX, y * width + x];
      const inside = inX >= 0 && inX < width && inY >= 0 && inY < height;
      paddedGlyph.pixels[outIdx] = inside
        ? glyph.pixels[inIdx]
        : glyph.keyColor;
    }
  }

  return paddedGlyph;
};
