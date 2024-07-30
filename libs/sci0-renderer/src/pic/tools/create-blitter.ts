import { type Vec2 } from '@4bitlabs/vec2';
import { DrawMode, Cel } from '@4bitlabs/sci0';
import { RawPlotter } from './screen';

export const createBlitter =
  (plot: RawPlotter, [stageWidth, stageHeight]: Readonly<Vec2>) =>
  (x0: number, y0: number, drawMode: DrawMode, cel: Cel): void => {
    if (DrawMode.isControlMode(drawMode) || DrawMode.isPriorityMode(drawMode))
      console.warn('unhandled CEL command on Control/Priority layer');

    if (!DrawMode.isVisualMode(drawMode)) return;

    const data = cel.pixels;
    for (let y = y0; y < y0 + cel.height; y++)
      for (let x = x0; x < x0 + cel.width; x++) {
        if (x >= stageWidth || y >= stageHeight) continue;

        const color = data[x + y * cel.width];
        if (color === cel.keyColor) continue;
        plot(x, y, color);
      }
  };
