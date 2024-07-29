import type { Vec2 } from '@4bitlabs/vec2';
import { createIndexedPixelData } from '@4bitlabs/image';
import { IsFillable, type Plotter, RawPlotter, type Screen } from './screen';
import {
  isControlMode,
  isPriorityMode,
  isVisualMode,
} from '../models/draw-mode';
import { type RenderResult } from './render-result';
import {
  createBrush,
  createFloodFill,
  createLine,
  createBlitter,
} from './tools';

type SetTValueFn = (n: number) => void;

export const createScreenBuffer = (
  forcePal: 0 | 1 | 2 | 3 | undefined,
  palettes: [Uint8Array, Uint8Array, Uint8Array, Uint8Array],
  [width, height]: Vec2,
): [RenderResult, Screen, SetTValueFn] => {
  const visible = createIndexedPixelData(width, height);
  const priority = createIndexedPixelData(width, height);
  const control = createIndexedPixelData(width, height);
  const tBuffer = new Uint32Array(width * height).fill(-1);

  let t = 0;
  const setTValue = (next: number) => {
    t = next;
  };

  visible.pixels.fill(0xff);
  priority.pixels.fill(0x00);
  control.pixels.fill(0x00);

  const setPixel: RawPlotter = (x: number, y: number, color: number) => {
    const idx = width * y + x;
    visible.pixels[idx] = (color & 0b1111) | (color << 4);
  };

  const plot: Plotter = (x: number, y: number, drawMode, drawCodes) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;

    const idx = width * y + x;

    if (isVisualMode(drawMode)) {
      const pal = forcePal ?? (drawCodes[0] / 40) >>> 0;
      const palette = palettes[pal];
      const palIndex = drawCodes[0] % 40 >>> 0;
      visible.pixels[idx] = palette[palIndex];
      tBuffer[idx] = t;
    }

    if (isPriorityMode(drawMode)) {
      priority.pixels[idx] = drawCodes[1];
    }

    if (isControlMode(drawMode)) {
      control.pixels[idx] = drawCodes[2];
    }
  };

  const isFillable: IsFillable = (x, y, drawMode) => {
    const idx = x + y * width;

    if (isVisualMode(drawMode)) {
      const dither = (x & 1) ^ (y & 1);
      const val = visible.pixels[idx];
      const [high, low] = [val >>> 4, val & 0b1111];
      return 0xf === (dither ? high : low);
    }

    /* TODO not sure if this is correct… but it looks *okay*-ish.
     * SCI Companion seems to be able to recognize the difference between "never-touched" pixels and
     * replaced 0x00 pixels in control and priority layers. Not sure if its intentional or not. But
     * may require a different way of modeling indexed "alpha" channel.
     */
    return (
      (isPriorityMode(drawMode) && priority.pixels[idx] === 0x00) ||
      (isControlMode(drawMode) && control.pixels[idx] === 0x00)
    );
  };

  return [
    { visible, priority, control, tBuffer },
    {
      setPixel,
      brush: createBrush(plot, [width, height]),
      fill: createFloodFill(plot, isFillable, [width, height]),
      line: createLine(plot),
      blit: createBlitter(setPixel, [width, height]),
    },
    setTValue,
  ];
};
