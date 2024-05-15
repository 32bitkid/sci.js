import { createScreenBuffer } from './screen-buffer';
import { DEFAULT_PALETTE } from './default-palette';
import { DrawCommand } from '../models/draw-command';
import { RenderResult } from './render-result';
import { exhaustive } from '../utils/exhaustive';

interface RenderOptions {
  forcePal?: 0 | 1 | 2 | 3 | undefined;
  width?: number;
  height?: number;
}

export const renderPic = (
  commands: DrawCommand[],
  options: RenderOptions = {},
): RenderResult => {
  const { forcePal, width = 320, height = 190 } = options;

  const palettes: [Uint8Array, Uint8Array, Uint8Array, Uint8Array] = [
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
  ];

  const [result, screen] = createScreenBuffer(forcePal, palettes, [
    width,
    height,
  ]);

  for (const cmd of commands) {
    const [mode] = cmd;

    switch (mode) {
      case 'SET_PALETTE': {
        const [, idx, palette] = cmd;
        palettes[idx].set(palette);
        break;
      }
      case 'UPDATE_PALETTE': {
        const [, entries] = cmd;
        entries.forEach(([pal, idx, color]) => {
          palettes[pal][idx] = color;
        });
        break;
      }
      case 'FILL': {
        const [, drawMode, drawCodes, pos] = cmd;
        const [x, y] = pos;
        screen.fill(x, y, drawMode, drawCodes);
        break;
      }
      case 'PLINE': {
        const [, drawMode, drawCodes, ...points] = cmd;
        for (let p = 0; p < points.length - 1; p++)
          screen.line(
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
        const [, drawMode, drawCodes, patternCode, textureCode, [cx, cy]] = cmd;
        screen.brush(cx, cy, ...patternCode, textureCode, drawMode, drawCodes);
        break;
      }
      case 'CEL': {
        const [, drawMode, [x, y], cel] = cmd;
        screen.blit(x, y, drawMode, cel);
        break;
      }
      default:
        exhaustive('unhandled opcode', mode);
    }
  }

  return result;
};
