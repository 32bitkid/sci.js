import type { Vec2 } from '@4bitlabs/vec2';
import type { Pic, DrawCommand } from '@4bitlabs/sci0';
import { createScreenBuffer } from './screen-buffer';
import { DEFAULT_PALETTE } from './default-palette';
import { RenderResult } from './render-result';
import type { Screen } from './tools/screen';
import { RenderPicOptions } from './render-pic-options';
import { exhaustive } from '../utils/exhaustive';

type PaletteSet = [Uint8Array, Uint8Array, Uint8Array, Uint8Array];
const defaultPalettes = (): PaletteSet => [
  Uint8Array.from(DEFAULT_PALETTE),
  Uint8Array.from(DEFAULT_PALETTE),
  Uint8Array.from(DEFAULT_PALETTE),
  Uint8Array.from(DEFAULT_PALETTE),
];

function picStep(
  cmd: DrawCommand,
  { fill, line, brush, blit }: Screen,
  palettes: [Uint8Array, Uint8Array, Uint8Array, Uint8Array],
) {
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

export function* generatePic(
  pic: Pic,
  options: RenderPicOptions = {},
): Generator<[number, DrawCommand, RenderResult]> {
  const { forcePal, width = 320, height = 190 } = options;
  const size: Vec2 = [width, height];

  const palettes = defaultPalettes();
  const [result, screen, tick] = createScreenBuffer(forcePal, palettes, size);

  let step = 0;
  for (const cmd of pic) {
    tick(step);
    picStep(cmd, screen, palettes);
    yield [step, cmd, result];
    step += 1;
  }
}

export const renderPic = (
  pic: Pic,
  options: RenderPicOptions = {},
): RenderResult => {
  const { forcePal, width = 320, height = 190 } = options;
  const size: Vec2 = [width, height];

  const palettes = defaultPalettes();
  const [result, screen, tick] = createScreenBuffer(forcePal, palettes, size);

  let step = 0;
  for (const cmd of pic) {
    tick(step);
    picStep(cmd, screen, palettes);
    step += 1;
  }

  return result;
};
