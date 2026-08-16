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
