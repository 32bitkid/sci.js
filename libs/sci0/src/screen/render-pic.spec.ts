import { DrawCommand, DrawMode } from '../models/draw-command';
import { renderPic } from './render-pic';

describe('edge cases', () => {
  it.each<[number, boolean]>([
    [1, true],
    [2, true],
    [0, false],
  ])('should leak out of white dithered lines', (lineColor, leaky) => {
    const picData: DrawCommand[] = [
      ['SET_PALETTE', 0, [0x00, 0xf0, 0x0f, 0xff]],
      [
        'PLINE',
        DrawMode.Visual,
        [lineColor, 0x0, 0x0],
        [10, 10],
        [10, 30],
        [30, 30],
        [30, 10],
        [10, 10],
      ],
      ['FILL', DrawMode.Visual, [0x0, 0x0, 0x0], [20, 20]],
    ];

    const { visible } = renderPic(picData);
    expect(visible.pixels[0]).toBe(leaky ? 0x00 : 0xff);
  });

  it.each<[number, boolean]>([
    [1, false],
    [2, true],
  ])('should leak out of single pixel dither "holes"', (lineColor, leaky) => {
    const picData: DrawCommand[] = [
      ['SET_PALETTE', 0, [0x00, 0xf0, 0x0f, 0xff]],
      // Draw a solid box with a 1px hole
      [
        'PLINE',
        DrawMode.Visual,
        [0, 0, 0],
        [20, 10],
        [10, 10],
        [10, 30],
        [30, 30],
        [30, 10],
        [21, 10],
      ],
      // Fill the hole with a single pixel dither
      ['PLINE', DrawMode.Visual, [lineColor, 0, 0], [21, 10], [21, 10]],
      ['FILL', DrawMode.Visual, [0x0, 0x0, 0x0], [20, 20]],
    ];

    const { visible } = renderPic(picData);
    expect(visible.pixels[0]).toBe(leaky ? 0x00 : 0xff);
  });
});
