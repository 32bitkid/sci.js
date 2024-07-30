import { DrawMode, DrawCodes } from '@4bitlabs/sci0';
import { Filler, Plotter } from './screen';

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
