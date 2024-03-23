import { type IndexedPixelData } from '@4bitlabs/image';
import { createScreenBuffer, ScreenBuffer } from './screen-buffer';
import { DEFAULT_PALETTE } from './default-palette';
import { DrawCommand, DrawMode } from '../models/draw-command';

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

  commands.forEach(function execStep(cmd) {
    const [mode] = cmd;

    switch (mode) {
      case 'SET_PALETTE': {
        const [, idx, palette] = cmd;
        palettes[idx] = palette;
        return;
      }
      case 'UPDATE_PALETTE': {
        const [, entries] = cmd;
        entries.forEach(([pal, idx, color]) => {
          const palette = Uint8Array.from(palettes[pal]);
          palette[idx] = color;
          palettes[pal] = palette;
        });
        return;
      }
      case 'FILL': {
        const [, drawMode, drawCodes, pos] = cmd;
        if ((drawMode & DrawMode.Visual) !== DrawMode.Visual) return;

        const pal = (drawCodes[0] / 40) >>> 0;
        const idx = drawCodes[0] % 40 >>> 0;
        const color = palettes[forcePal ?? pal][idx];
        const [x, y] = pos;
        visible.fill(x, y, color);
        break;
      }
      case 'PLINE': {
        const [, drawMode, drawCodes, ...points] = cmd;
        if ((drawMode & DrawMode.Visual) !== DrawMode.Visual) return;

        const pal = (drawCodes[0] / 40) >>> 0;
        const idx = drawCodes[0] % 40 >>> 0;
        const color = palettes[forcePal ?? pal][idx];

        for (let p = 0; p < points.length - 1; p++)
          visible.line(
            points[p][0],
            points[p][1],
            points[p + 1][0],
            points[p + 1][1],
            color,
          );
        break;
      }
      case 'BRUSH': {
        const [, drawMode, drawCodes, patternCode, textureCode, [cx, cy]] = cmd;
        if ((drawMode & DrawMode.Visual) !== DrawMode.Visual) return;

        const pal = (drawCodes[0] / 40) >>> 0;
        const idx = drawCodes[0] % 40 >>> 0;
        const color = palettes[forcePal ?? pal][idx];
        visible.brush(cx, cy, ...patternCode, textureCode, color);
        break;
      }
      case 'CEL': {
        const [, drawMode, pos, cel] = cmd;
        if ((drawMode & DrawMode.Visual) !== DrawMode.Visual) return;

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
  });

  return {
    visible: extractPixelData(visible),
    priority: extractPixelData(priority),
    control: extractPixelData(control),
  };
};
