import type { Glyph } from '@4bitlabs/sci0';

export function xorPixels(char: Glyph, xor: string[]): Glyph {
  const updated = {
    ...char,
    pixels: Uint8ClampedArray.from(char.pixels),
  };
  for (let y = 0; y < Math.min(char.height, xor.length); y += 1) {
    const line = xor[y] ?? '';
    for (let x = 0; x < Math.min(char.width, line.length); x += 1) {
      const idx = y * char.width + x;
      const left = updated.pixels[idx] !== char.keyColor ? 0xff : 0x00;
      const right = (line[x] ?? ' ') !== ' ' ? 0xff : 0x00;
      updated.pixels[idx] = left ^ right ? char.color : char.keyColor;
    }
  }
  return updated;
}

export function compositeGlyph(
  gl: Glyph,
  other: Glyph | undefined,
  coords: [number, number] = [0, 0],
): Glyph {
  if (!other) return gl;

  const [dx = 0, dy = 0] = coords;
  const { width, height, color, keyColor } = gl;
  const nextGlyph: Glyph = {
    width,
    height,
    color,
    keyColor,
    pixels: Uint8ClampedArray.from(gl.pixels),
  };

  if (other) {
    for (let iy = 0; iy < other.height; iy += 1) {
      const oy = iy + dy;
      if (oy >= nextGlyph.height) break;
      for (let ix = 0; ix < other.width; ix += 1) {
        const ox = ix + dx;
        if (ox >= nextGlyph.width) break;
        if (other.pixels[iy * other.width + ix] === other.keyColor) continue;

        nextGlyph.pixels[oy * nextGlyph.width + ox] = nextGlyph.color;
      }
    }
  }

  return nextGlyph;
}
