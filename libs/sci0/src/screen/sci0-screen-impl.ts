import { NumericDeque } from '@4bitlabs/numeric-deque';
import CIRCLES from './circles';
import { NOISE, NOISE_OFFSETS } from './noise';
import { Plotter, Brusher, IsFillable, Filler, Liner } from './screen';
import { StaticVec2 } from '../models/vec2';
import { DrawCodes, DrawMode } from '../models/draw-command';

export const createLine = (plot: Plotter): Liner =>
  function line(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    drawMode: DrawMode,
    drawCodes: DrawCodes,
  ): void {
    if (x0 === x1) {
      for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++)
        plot(x0, y, drawMode, drawCodes);
      return;
    }

    if (y0 === y1) {
      for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
        plot(x, y0, drawMode, drawCodes);
      return;
    }

    plot(x0, y0, drawMode, drawCodes);
    plot(x1, y1, drawMode, drawCodes);

    const dx = x1 - x0;
    const dy = y1 - y0;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    const sx = dx > 0 ? 1 : -1;
    const sy = dy > 0 ? 1 : -1;

    let eps = 0;

    if (adx > ady) {
      for (let x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
        plot(x, y, drawMode, drawCodes);
        eps += ady;
        if (eps << 1 >= adx) {
          y += sy;
          eps -= adx;
        }
      }
    } else {
      for (let x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
        plot(x, y, drawMode, drawCodes);
        eps += adx;
        if (eps << 1 >= ady) {
          x += sx;
          eps -= ady;
        }
      }
    }
  };

export const createFloodFill = (
  plot: Plotter,
  isLegal: IsFillable,
  [width, height]: StaticVec2,
): Filler => {
  const visited = new Uint8ClampedArray(width * height);
  const stack = new NumericDeque(width * height, Uint32Array);

  return function floodFill(
    ix: number,
    iy: number,
    drawMode: DrawMode,
    drawCodes: DrawCodes,
  ): void {
    visited.fill(0);
    stack.clear();

    const start = iy * width + ix;
    stack.push(start);

    do {
      const i = stack.shift();

      if (visited[i]) continue;
      visited[i] = 0xff;

      const x = i % width;
      const y = (i / width) >>> 0;

      plot(x, y, drawMode, drawCodes);

      const initialAbove =
        y - 1 >= 0 && !visited[i - width] && isLegal(x, y - 1, drawMode);
      const initialBelow =
        y + 1 < height && !visited[i + width] && isLegal(x, y + 1, drawMode);

      if (initialAbove) stack.push(i - width);
      if (initialBelow) stack.push(i + width);

      // scan right and left
      for (let dir = 1; dir >= -1; dir -= 2) {
        let visitedAbove = initialAbove;
        let visitedBelow = initialBelow;

        for (
          let sx = x + dir;
          (dir > 0 ? sx < width : sx >= 0) && isLegal(sx, y, drawMode);
          sx += dir
        ) {
          const idx = i + (sx - x);
          visited[idx] = 0xff;
          plot(sx, y, drawMode, drawCodes);

          if (y - 1 >= 0 && !visited[idx - width]) {
            if (isLegal(sx, y - 1, drawMode)) {
              if (!visitedAbove) stack.push(idx - width);
              visitedAbove = true;
            } else {
              visitedAbove = false;
            }
          }

          if (y + 1 < height && !visited[idx + width]) {
            if (isLegal(sx, y + 1, drawMode)) {
              if (!visitedBelow) stack.push(idx + width);
              visitedBelow = true;
            } else {
              visitedBelow = false;
            }
          }
        }
      }
    } while (!stack.isEmpty());
  };
};

export const createBrush = (
  plot: Plotter,
  [stageWidth, stageHeight]: StaticVec2,
): Brusher =>
  function brush(
    cx,
    cy,
    size,
    isRect,
    isSpray,
    textureCode,
    drawMode: DrawMode,
    drawCodes: DrawCodes,
  ): void {
    const baseWidth = isRect ? 2 : 1;
    const width = baseWidth + size * 2;
    const height = 1 + size * 2;

    let top = Math.max(0, cy - size);
    let left = Math.max(0, cx - size);
    const bottom = top + height;
    const right = left + width;
    if (right >= stageWidth) left = stageWidth - width;
    if (bottom >= stageHeight) top = stageHeight - height;

    let noiseIdx = NOISE_OFFSETS[textureCode];

    for (let py = top; py < bottom; py += 1)
      for (let px = left; px < right; px += 1) {
        if (!isRect) {
          const sprite = CIRCLES[size];
          const row = sprite[py - top];
          const shift = width - (px - left) - 1;
          if (((row >>> shift) & 0b1) === 0) continue;
        }
        if (isSpray && !NOISE[noiseIdx++ & 0xff]) continue;
        plot(px, py, drawMode, drawCodes);
      }
  };

export const createMarker = (plot: Plotter): Filler =>
  function marker(
    x: number,
    y: number,
    drawMode: DrawMode,
    drawCodes: DrawCodes,
  ): void {
    plot(x - 1, y, drawMode, drawCodes);
    plot(x, y - 1, drawMode, drawCodes);
    plot(x + 1, y, drawMode, drawCodes);
    plot(x, y + 1, drawMode, drawCodes);
  };
