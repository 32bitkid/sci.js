import { createBuffer } from './buffer';
import { ImageFilter, ImageDataLike } from '@4bitlabs/image';

import { DrawCommand, DrawMode } from '../models/draw-command';

import { DEFAULT_PALETTE } from './default-palette';
import { classicDitherer } from './ditherizer';

interface RenderOptions {
  forcePal?: 0 | 1 | 2 | 3 | undefined;
  pipeline?: ImageFilter[];
}

interface RenderResult {
  visible: ImageDataLike;
  priority: ImageDataLike;
  control: ImageDataLike;
}

export const renderPic = (
  commands: DrawCommand[],
  options: RenderOptions = {},
): RenderResult => {
  const { forcePal } = options;

  const visible = createBuffer(0xff0000ff, 32);
  const priority = createBuffer(0x00, 8);
  const control = createBuffer(0x00, 8);

  const palettes: [Uint8Array, Uint8Array, Uint8Array, Uint8Array] = [
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
  ];

  commands.forEach((cmd) => {
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
        if (pal !== 0) console.log(pal);
        const color = palettes[forcePal ?? pal][idx];
        const [x, y] = pos;

        visible.fill([x, y], color);
        break;
      }
      case 'PLINE': {
        const [, drawMode, drawCodes, ...points] = cmd;
        if ((drawMode & DrawMode.Visual) !== DrawMode.Visual) return;

        const pal = (drawCodes[0] / 40) >>> 0;
        const idx = drawCodes[0] % 40 >>> 0;
        if (pal !== 0) console.log(pal);
        const color = palettes[forcePal ?? pal][idx];

        for (let p = 0; p < points.length - 1; p++)
          visible.line(points[p], points[p + 1], color);
        break;
      }
      case 'BRUSH': {
        const [, drawMode, drawCodes, patternCode, textureCode, pos] = cmd;
        if ((drawMode & DrawMode.Visual) !== DrawMode.Visual) return;

        const pal = (drawCodes[0] / 40) >>> 0;
        const idx = drawCodes[0] % 40 >>> 0;
        if (pal !== 0) console.log(pal);
        const color = palettes[forcePal ?? pal][idx];
        visible.brush(pos, ...patternCode, textureCode, color);
        break;
      }
      case 'CEL': {
        const [, drawMode, pos, cel] = cmd;
        if ((drawMode & DrawMode.Visual) !== DrawMode.Visual) return;

        const data = new Uint8Array(cel.data);
        for (let y = pos[1]; y < pos[1] + cel.height; y++)
          for (let x = pos[0]; x < pos[0] + cel.width; x++) {
            if (x >= 320 || y >= 190) continue;

            const color = data[x + y * cel.width];
            if (color === cel.keyColor) continue;
            visible.plot([x, y], color | (color << 4));
          }
        break;
      }
      default:
        console.log('unhandled opcode', mode);
    }
  });

  const { pipeline = [classicDitherer] } = options;

  return {
    visible: pipeline.reduce((prev, op) => op(prev), visible.image),
    priority: priority.image,
    control: control.image,
  };
};
