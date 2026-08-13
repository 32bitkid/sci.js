import type { IndexedPixelData } from '@4bitlabs/image';
import type { FontFace } from '@4bitlabs/sci0';
import { range } from './range.js';

export function actualBottom(char: IndexedPixelData): number {
  for (let dy = 0; dy < char.height; dy++) {
    const y = char.height - dy - 1;
    const empty = [...range(0, char.width - 1)].every(
      (x) => char.pixels[x + y * char.width] === char.keyColor,
    );
    if (!empty) return y + 1;
  }

  return char.height - 1;
}

export function guessBaseline(font: FontFace): number {
  const xChar = font.characters['x'.charCodeAt(0)];
  return actualBottom(xChar);
}
