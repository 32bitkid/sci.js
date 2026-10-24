import { NumericDeque } from '@4bitlabs/numeric-deque';
import type { Vec2 } from '@4bitlabs/vec2';
import type { DrawMode, DrawCodes, PicState } from '@4bitlabs/sci0';
import type { Filler, IsFillable, Plotter } from './screen.js';

export const createFloodFill = (
  plot: Plotter,
  isLegal: IsFillable,
  [width, height]: Readonly<Vec2>,
): Filler => {
  const visited = new Uint8ClampedArray(width * height);
  const stack = new NumericDeque(width * height, Uint32Array);

  return function floodFill(state: PicState, ix: number, iy: number): void {
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

      if (!isLegal(state, x, y)) continue;
      plot(state, x, y);

      const initialAbove =
        y - 1 >= 0 && !visited[i - width] && isLegal(state, x, y - 1);
      const initialBelow =
        y + 1 < height && !visited[i + width] && isLegal(state, x, y + 1);

      if (initialAbove) stack.push(i - width);
      if (initialBelow) stack.push(i + width);

      // scan right and left
      for (let dir = 1; dir >= -1; dir -= 2) {
        let visitedAbove = initialAbove;
        let visitedBelow = initialBelow;

        for (
          let sx = x + dir;
          (dir > 0 ? sx < width : sx >= 0) && isLegal(state, sx, y);
          sx += dir
        ) {
          const idx = i + (sx - x);
          visited[idx] = 0xff;
          plot(state, sx, y);

          if (y - 1 >= 0 && !visited[idx - width]) {
            if (isLegal(state, sx, y - 1)) {
              if (!visitedAbove) stack.push(idx - width);
              visitedAbove = true;
            } else {
              visitedAbove = false;
            }
          }

          if (y + 1 < height && !visited[idx + width]) {
            if (isLegal(state, sx, y + 1)) {
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
