import {
  DrawMode,
  isControlMode,
  isPriorityMode,
  isVisualMode,
} from '../../models/draw-command';
import { Cel } from '../../models/cel';
import { RawPlotter } from '../screen';
import { StaticVec2 } from '../../models/vec2';

export const createBlitter =
  (plot: RawPlotter, [stageWidth, stageHeight]: StaticVec2) =>
  (x0: number, y0: number, drawMode: DrawMode, cel: Cel) => {
    if (isControlMode(drawMode) || isPriorityMode(drawMode))
      console.warn('unhandled CEL command on Control/Priority layer');

    if (!isVisualMode(drawMode)) return;

    const data = cel.pixels;
    for (let y = y0; y < y0 + cel.height; y++)
      for (let x = x0; x < x0 + cel.width; x++) {
        if (x >= stageWidth || y >= stageHeight) continue;

        const color = data[x + y * cel.width];
        if (color === cel.keyColor) continue;
        plot(x, y, color);
      }
  };