import { createIndexedPixelData } from '@4bitlabs/image';
import { IsFillable, type Plotter, RawPlotter, type Screen } from './screen';
import { DrawMode } from '../models/draw-command';
import { type RenderResult } from './render-result';
import { createLine, createFloodFill, createBrush } from './tools';

const bufferWidth = 320;
const bufferHeight = 190;

export const createScreenBuffer = (
  forcePal: 0 | 1 | 2 | 3 | undefined,
  palettes: [Uint8Array, Uint8Array, Uint8Array, Uint8Array],
): [RenderResult, Screen] => {
  const visible = createIndexedPixelData(bufferWidth, bufferHeight);
  const priority = createIndexedPixelData(bufferWidth, bufferHeight);
  const control = createIndexedPixelData(bufferWidth, bufferHeight);
  const alpha = createIndexedPixelData(bufferWidth, bufferHeight);

  visible.pixels.fill(0xff);
  priority.pixels.fill(0x00);
  control.pixels.fill(0x00);

  const setPixel: RawPlotter = (x: number, y: number, color: number) => {
    const idx = bufferWidth * y + x;
    visible.pixels[idx] = (color & 0b1111) | (color << 4);
  };

  const plot: Plotter = (x: number, y: number, drawMode, drawCodes) => {
    const idx = bufferWidth * y + x;

    if ((drawMode & DrawMode.Visual) === DrawMode.Visual) {
      const pal = forcePal ?? (drawCodes[0] / 40) >>> 0;
      const palette = palettes[pal];
      const palIndex = drawCodes[0] % 40 >>> 0;
      visible.pixels[idx] = palette[palIndex];
      alpha.pixels[idx] = 255;
    }

    if ((drawMode & DrawMode.Priority) === DrawMode.Priority) {
      priority.pixels[idx] = drawCodes[1];
    }

    if ((drawMode & DrawMode.Control) === DrawMode.Control) {
      control.pixels[idx] = drawCodes[2];
    }
  };

  const isFillable: IsFillable = (x, y, drawMode) => {
    const idx = x + y * bufferWidth;

    const isVisible = (drawMode & DrawMode.Visual) === DrawMode.Visual;
    if (isVisible) {
      const dither = (x & 1) ^ (y & 1);
      const val = visible.pixels[idx];
      return 0xf === (dither ? val & 0xf : val >>> 4);
    }

    /* TODO not sure if this is correct… but it looks *okay*-ish.
     * SCI Companion seems to be able to recognize the difference between "never-touched" pixels and
     * replaced 0x00 pixels in control and priority layers. Not sure if its intentional or not. But
     * may require a different way of modeling indexed "alpha" channel.
     */
    const isPriority = (drawMode & DrawMode.Priority) === DrawMode.Priority;
    const isControl = (drawMode & DrawMode.Control) === DrawMode.Control;
    return (
      (isPriority && priority.pixels[idx] === 0x00) ||
      (isControl && control.pixels[idx] === 0x00)
    );
  };

  return [
    { visible, priority, control, alpha },
    {
      setPixel,
      brush: createBrush(plot, [bufferWidth, bufferHeight]),
      fill: createFloodFill(plot, isFillable, [bufferWidth, bufferHeight]),
      line: createLine(plot),
    },
  ];
};
