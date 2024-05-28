import { Brusher, Plotter } from '../screen';
import { Vec2 } from '../../models/vec2';
import { DrawCodes, DrawMode } from '../../models/draw-command';
import { NOISE, NOISE_OFFSETS } from './noise';
import CIRCLES from './circles';

export const createBrush = (
  plot: Plotter,
  [stageWidth, stageHeight]: Readonly<Vec2>,
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
