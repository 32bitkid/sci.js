import type { DrawCommand, PicState } from '@4bitlabs/sci0';
import type { Screen } from './tools/screen.js';
import { exhaustive } from '../utils/exhaustive.js';

export function picStep(
  cmd: DrawCommand,
  screen: Screen,
  state: PicState,
): void {
  const { fill, line, brush, blit } = screen;
  const [mode] = cmd;
  switch (mode) {
    case 'FILL': {
      const [, pos] = cmd;
      const [x, y] = pos;
      fill(state, x, y);
      break;
    }
    case 'PLINE': {
      const [, ...points] = cmd;
      for (let p = 0; p < points.length - 1; p++)
        line(
          state,
          points[p][0],
          points[p][1],
          points[p + 1][0],
          points[p + 1][1],
        );
      break;
    }
    case 'BRUSH': {
      const [, texture, [cx, cy]] = cmd;
      brush(state, cx, cy, texture);
      break;
    }
    case 'CEL': {
      const [, [x, y], cel] = cmd;
      blit(state, x, y, cel);
      break;
    }
    default:
      exhaustive('unhandled opcode', mode);
  }
}
