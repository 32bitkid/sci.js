import type { Vec2 } from '@4bitlabs/vec2';
import { createIndexedPixelData } from '@4bitlabs/image';
import { DrawMode, type PicState } from '@4bitlabs/sci0';
import type {
  Brusher,
  Filler,
  IsFillable,
  Liner,
  Plotter,
  RawPlotter,
  Screen,
} from './tools/screen.js';
import type { RenderResult } from './render-result.js';
import {
  createBrush,
  createFloodFill,
  createLine,
  createBlitter,
} from './tools/index.js';
import { createPalettes, type PaletteSet } from './create-palettes.js';
import { resolveDither } from './resolve-dither.js';
import { DEFAULT_MONO, DEFAULT_PALETTE } from './default-palette.js';

export type SetTValueFn = (n: number) => void;

const projectPals = (source: Readonly<Uint8Array>): PaletteSet => [
  new Uint8Array(source.buffer, source.byteOffset, 40),
  new Uint8Array(source.buffer, source.byteOffset + 40, 40),
  new Uint8Array(source.buffer, source.byteOffset + 80, 40),
  new Uint8Array(source.buffer, source.byteOffset + 120, 40),
];

const joinSideEffects =
  <T extends unknown[]>(
    ...fns: ((...args: T) => void)[]
  ): ((...args: T) => void) =>
  (...args: T): void => {
    for (const fn of fns) fn(...args);
  };

export const createScreenBuffer = (
  [width, height]: Vec2,
  forcePal?: 0 | 1 | 2 | 3,
): [RenderResult, Screen, SetTValueFn] => {
  const visible = createIndexedPixelData(width, height);
  const priority = createIndexedPixelData(width, height);
  const control = createIndexedPixelData(width, height);
  const mono = createIndexedPixelData(width, height);
  const tBuffer = new Uint32Array(width * height).fill(-1);

  let t = 0;
  const setTValue = (next: number) => {
    t = next;
  };

  visible.pixels.fill(0xff);
  priority.pixels.fill(0x00);
  control.pixels.fill(0x00);
  mono.pixels.fill(0x0f);

  const plotM: Plotter = (state, x, y) => {
    const idx = width * y + x;
    if (idx < 0 || idx > width * height) return;

    if (DrawMode.isMonoMode(state.drawMode)) {
      const pal = (state.drawCodes[3] / 40) >>> 0;
      const palIndex = (state.drawCodes[3] % 40) >>> 0;
      mono.pixels[idx] = projectPals(state.monoPalette)[pal][palIndex];
    } else if (DrawMode.isMonoDirectMode(state.drawMode)) {
      mono.pixels[idx] = state.drawCodes[3];
    }
  };

  const plotV: Plotter = (state, x, y) => {
    if (!DrawMode.isVisualMode(state.drawMode)) return;
    const idx = width * y + x;
    if (idx < 0 || idx > width * height) return;

    const pal = forcePal ?? (state.drawCodes[0] / 40) >>> 0;
    const palette = projectPals(state.palette)[pal];
    const palIndex = (state.drawCodes[0] % 40) >>> 0;
    visible.pixels[idx] = palette[palIndex];
    tBuffer[idx] = t;
  };

  const plotP: Plotter = (state, x, y) => {
    if (!DrawMode.isPriorityMode(state.drawMode)) return;
    const idx = width * y + x;
    if (idx < 0 || idx > width * height) return;
    priority.pixels[idx] = state.drawCodes[1];
  };

  const plotC: Plotter = (state, x, y) => {
    if (!DrawMode.isControlMode(state.drawMode)) return;
    const idx = width * y + x;
    if (idx < 0 || idx > width * height) return;
    control.pixels[idx] = state.drawCodes[1];
  };

  const isEmptyV: IsFillable = ({ drawMode }, x, y) => {
    if (!DrawMode.isVisualMode(drawMode)) return false;
    const idx = x + y * width;
    const dither = (x & 1) ^ (y & 1);
    const val = visible.pixels[idx];
    const [high, low] = [val >>> 4, val & 0b1111];
    return 0xf === (dither ? high : low);
  };

  const isEmptyP: IsFillable = ({ drawMode }, x, y) =>
    DrawMode.isPriorityMode(drawMode) &&
    priority.pixels[x + y * width] === 0x00;

  const isEmptyC: IsFillable = ({ drawMode }, x, y) =>
    DrawMode.isControlMode(drawMode) && priority.pixels[x + y * width] === 0x00;

  const isEmptyM: IsFillable = (_, x, y) => {
    const idx = x + y * width;
    return mono.pixels[idx] === 0xf;
  };

  const rawPlot: RawPlotter = (x: number, y: number, color: number) => {
    const idx = width * y + x;
    visible.pixels[idx] = (color & 0b1111) | (color << 4);
  };

  return [
    { visible, priority, control, mono, tBuffer },
    {
      brush: joinSideEffects(
        createBrush(plotV, [width, height]),
        createBrush(plotP, [width, height]),
        createBrush(plotC, [width, height]),
        createBrush(plotM, [width, height]),
      ),
      fill: joinSideEffects(
        createFloodFill(plotV, isEmptyV, [width, height]),
        createFloodFill(plotP, isEmptyP, [width, height]),
        createFloodFill(plotC, isEmptyC, [width, height]),
        createFloodFill(plotM, isEmptyM, [width, height]),
      ),
      line: joinSideEffects(
        createLine(plotV),
        createLine(plotP),
        createLine(plotC),
        createLine(plotM),
      ),
      blit: createBlitter(rawPlot, [width, height]),
      resolveDither: (state) =>
        resolveDither(state.drawCodes, projectPals(state.palette), forcePal),
    },
    setTValue,
  ];
};
