import { Liner, Plotter } from '../screen';
import { DrawMode } from '../../models/draw-mode';
import { DrawCodes } from '../../models/draw-codes';

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
