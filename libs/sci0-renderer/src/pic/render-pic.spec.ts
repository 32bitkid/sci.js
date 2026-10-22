import { describe, expect, it } from 'vitest';
import type { Pic } from '@4bitlabs/sci0';
import { renderPic } from './render-pic.js';

describe('edge cases', () => {
  it.each<[number, boolean]>([
    [1, true],
    [2, true],
    [0, false],
  ])('should leak out of white dithered lines', (lineColor, leaky) => {
    const picData = [
      ['SET_PALETTE', 0, 0x00, 0xf0, 0x0f, 0xff],
      ['SET_VISUAL', lineColor],
      ['PLINE', [10, 10], [10, 30], [30, 30], [30, 10], [10, 10]],
      ['SET_VISUAL', 0x0],
      ['FILL', [20, 20]],
    ] satisfies Pic;

    const { visible } = renderPic(picData);
    expect(visible.pixels[0]).toBe(leaky ? 0x00 : 0xff);
  });

  it.each<[number, boolean]>([
    [1, true],
    [2, false],
  ])('should leak out of single pixel dither "holes"', (lineColor, leaky) => {
    const picData = [
      ['SET_PALETTE', 0, 0x00, 0xf0, 0x0f, 0xff],
      // Draw a solid box with a 1px hole
      ['SET_VISUAL', 0],
      ['PLINE', [20, 10], [10, 10], [10, 30], [30, 30], [30, 10], [21, 10]],
      // Fill the hole with a single pixel dither
      ['SET_VISUAL', lineColor],
      ['PLINE', [21, 10], [21, 10]],
      ['SET_VISUAL', 0],
      ['FILL', [20, 20]],
    ] satisfies Pic;

    const { visible } = renderPic(picData);
    expect(visible.pixels[0]).toBe(leaky ? 0x00 : 0xff);
  });
});
