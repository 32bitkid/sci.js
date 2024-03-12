import { Plotter, Brusher, IsFillable, Filler } from './screen';
import { NOISE, NOISE_OFFSETS } from './noise';
import CIRCLES from './circles';
import { StaticVec2 } from '../models/vec2';

export const createLine = (plot: Plotter) =>
  function line(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    clr: number,
  ): void {
    if (x0 === x1) {
      for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++)
        plot(x0, y, clr);
      return;
    }

    if (y0 === y1) {
      for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
        plot(x, y0, clr);
      return;
    }

    plot(x0, y0, clr);
    plot(x1, y1, clr);

    const dx = x1 - x0;
    const dy = y1 - y0;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    const sx = dx > 0 ? 1 : -1;
    const sy = dy > 0 ? 1 : -1;

    let eps = 0;

    if (adx > ady) {
      for (let x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
        plot(x, y, clr);
        eps += ady;
        if (eps << 1 >= adx) {
          y += sy;
          eps -= adx;
        }
      }
    } else {
      for (let x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
        plot(x, y, clr);
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
  const visited = new Set<number>();
  const stack: number[] = [];

  return function floodFill(x: number, y: number, color: number): void {
    const startI = y * width + x;
    stack.push(startI);

    while (stack.length > 0) {
      const i = stack.shift()!;

      if (visited.has(i)) continue;
      visited.add(i);

      const x = i % width;
      const y = (i / width) >>> 0;

      if (!isLegal(x, y)) continue;

      plot(x, y, color);

      if (y - 1 >= 0 && !visited.has(i - width)) stack.push(i - width);
      if (y + 1 < height && !visited.has(i + width)) stack.push(i + width);
      if (x - 1 >= 0 && !visited.has(i - 1)) stack.push(i - 1);
      if (x + 1 < width && !visited.has(i + 1)) stack.push(i + 1);
    }

    visited.clear();
  };
};

export const createBrush = (
  plot: Plotter,
  [stageWidth, stageHeight]: StaticVec2,
): Brusher =>
  function brush(cx, cy, size, isRect, isSpray, textureCode, color): void {
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
        plot(px, py, color);
      }
  };

export const createMarker = (plot: Plotter): Filler =>
  function marker(x: number, y: number, color: number): void {
    plot(x - 1, y, color);
    plot(x, y - 1, color);
    plot(x + 1, y, color);
    plot(x, y + 1, color);
  };
