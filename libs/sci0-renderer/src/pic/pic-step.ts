import type { DrawCommand } from '@4bitlabs/sci0';
import type { Screen } from './tools/screen';
import { exhaustive } from '../utils/exhaustive';

export function picStep(
  cmd: DrawCommand,
  { fill, line, brush, blit }: Screen,
  palettes: [Uint8Array, Uint8Array, Uint8Array, Uint8Array],
): void {
  const [mode] = cmd;
  switch (mode) {
    case 'SET_PALETTE': {
      const [, [idx], ...palette] = cmd;
      palettes[idx].set(palette);
      break;
    }
    case 'UPDATE_PALETTE': {
      const [, , ...entries] = cmd;
      entries.forEach(([pal, idx, color]) => {
        palettes[pal][idx] = color;
      });
      break;
    }
    case 'FILL': {
      const [, [drawMode, drawCodes], pos] = cmd;
      const [x, y] = pos;
      fill(x, y, drawMode, drawCodes);
      break;
    }
    case 'PLINE': {
      const [, [drawMode, drawCodes], ...points] = cmd;
      for (let p = 0; p < points.length - 1; p++)
        line(
          points[p][0],
          points[p][1],
          points[p + 1][0],
          points[p + 1][1],
          drawMode,
          drawCodes,
        );
      break;
    }
    case 'BRUSH': {
      const [, brushOptions, [cx, cy]] = cmd;
      brush(cx, cy, ...brushOptions);
      break;
    }
    case 'CEL': {
      const [, [drawMode], [x, y], cel] = cmd;
      blit(x, y, drawMode, cel);
      break;
    }
    default:
      exhaustive('unhandled opcode', mode);
  }
}
