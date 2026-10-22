import type { DrawCommand, PicState } from '@4bitlabs/sci0';
import type { Screen } from './tools/screen.js';
import { exhaustive } from '../utils/exhaustive.js';

export function picStep(
  cmd: DrawCommand,
  screen: Screen,
  state: PicState,
): void {
  const { fill, line, brush, blit, setPalette, updatePalette } = screen;
  const [mode] = cmd;
  switch (mode) {
    case 'SET_PALETTE': {
      const [, idx, ...palette] = cmd;
      setPalette(idx, palette);
      break;
    }
    case 'UPDATE_PALETTE': {
      const [, , ...entries] = cmd;
      updatePalette(entries);
      break;
    }
    case 'FILL': {
      const [, pos] = cmd;
      const [x, y] = pos;
      fill(x, y, state.drawMode, state.drawCodes);
      break;
    }
    case 'PLINE': {
      const [, ...points] = cmd;
      for (let p = 0; p < points.length - 1; p++)
        line(
          points[p][0],
          points[p][1],
          points[p + 1][0],
          points[p + 1][1],
          state.drawMode,
          state.drawCodes,
        );
      break;
    }
    case 'BRUSH': {
      const [, texture, [cx, cy]] = cmd;
      brush(
        cx,
        cy,
        state.drawMode,
        state.drawCodes,
        state.patternCode,
        texture,
      );
      break;
    }
    case 'CEL': {
      const [, [x, y], cel] = cmd;
      blit(x, y, state.drawMode, cel);
      break;
    }

    case 'SET_MONO_PALETTE':
    case 'SET_MONO':
    case 'SET_MONO_DIRECT':
    case 'CLEAR_MONO':
    case 'CLEAR_MONO_DIRECT':
    case 'SET_PRIORITY_BANDS':
    case 'SET_VISUAL':
    case 'SET_CONTROL':
    case 'SET_PRIORITY':
    case 'CLEAR_VISUAL':
    case 'CLEAR_CONTROL':
    case 'CLEAR_PRIORITY':
    case 'SET_PATTERN':
      /** noop */
      break;

    default:
      exhaustive('unhandled opcode', mode);
  }
}
