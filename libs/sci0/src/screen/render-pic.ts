import { type IndexedPixelData } from '@4bitlabs/image';
import { createScreenBuffer, ScreenBuffer } from './screen-buffer';
import { DEFAULT_PALETTE } from './default-palette';
import { DrawCodes, DrawCommand, DrawMode } from '../models/draw-command';

interface RenderOptions {
  forcePal?: 0 | 1 | 2 | 3 | undefined;
}

interface RenderResult {
  visible: IndexedPixelData;
  priority: IndexedPixelData;
  control: IndexedPixelData;
}

function extractPixelData(buffer: ScreenBuffer): IndexedPixelData {
  const { brush, fill, line, plot, ...pixelData } = buffer;
  return pixelData;
}

export const renderPic = (
  commands: DrawCommand[],
  options: RenderOptions = {},
): RenderResult => {
  const { forcePal } = options;

  const visible = createScreenBuffer(0xff);
  const priority = createScreenBuffer(0x00);
  const control = createScreenBuffer(0x00);

  const palettes: [Uint8Array, Uint8Array, Uint8Array, Uint8Array] = [
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
  ];

  const which: [ScreenBuffer, (drawCodes: DrawCodes) => number][] = [
    [
      visible,
      (drawCodes: DrawCodes) => {
        const pal = (drawCodes[0] / 40) >>> 0;
        const idx = drawCodes[0] % 40 >>> 0;
        return palettes[forcePal ?? pal][idx];
      },
    ],
    [priority, (drawCodes: DrawCodes) => drawCodes[1]],
    [control, (drawCodes: DrawCodes) => drawCodes[2]],
  ];

  for (const cmd of commands) {
    const [mode] = cmd;

    switch (mode) {
      case 'SET_PALETTE': {
        const [, idx, palette] = cmd;
        palettes[idx] = palette;
        break;
      }
      case 'UPDATE_PALETTE': {
        const [, entries] = cmd;
        entries.forEach(([pal, idx, color]) => {
          const palette = Uint8Array.from(palettes[pal]);
          palette[idx] = color;
          palettes[pal] = palette;
        });
        break;
      }
      case 'FILL': {
        const [, drawMode, drawCodes, pos] = cmd;
        for (let mode = 0; mode < 3; mode++) {
          if ((drawMode & (1 << mode)) === 0) continue;

          const [x, y] = pos;
          const [layer, color] = which[mode];
          layer.fill(x, y, color(drawCodes));
        }
        break;
      }
      case 'PLINE': {
        const [, drawMode, drawCodes, ...points] = cmd;

        for (let mode = 0; mode < 3; mode++) {
          if ((drawMode & (1 << mode)) === 0) continue;
          const [layer, color] = which[mode];
          for (let p = 0; p < points.length - 1; p++)
            layer.line(
              points[p][0],
              points[p][1],
              points[p + 1][0],
              points[p + 1][1],
              color(drawCodes),
            );
        }
        break;
      }
      case 'BRUSH': {
        const [, drawMode, drawCodes, patternCode, textureCode, [cx, cy]] = cmd;

        for (let mode = 0; mode < 3; mode++) {
          if ((drawMode & (1 << mode)) === 0) continue;
          const [layer, color] = which[mode];
          layer.brush(cx, cy, ...patternCode, textureCode, color(drawCodes));
        }
        break;
      }
      case 'CEL': {
        const [, drawMode, pos, cel] = cmd;
        if ((drawMode & DrawMode.Visual) !== DrawMode.Visual) continue;

        const data = cel.pixels;
        for (let y = pos[1]; y < pos[1] + cel.height; y++)
          for (let x = pos[0]; x < pos[0] + cel.width; x++) {
            if (x >= 320 || y >= 190) continue;

            const color = data[x + y * cel.width];
            if (color === cel.keyColor) continue;
            visible.plot(x, y, color | (color << 4));
          }
        break;
      }
      default:
        console.log(`unhandled opcode: ${mode}`);
    }
  }

  return {
    visible: extractPixelData(visible),
    priority: extractPixelData(priority),
    control: extractPixelData(control),
  };
};
