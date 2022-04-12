import { vec2 } from 'gl-matrix';

import {
  DrawCommand,
  DrawMode,
  ImageFilter,
  ImageLike,
  IsFillable,
  Plotter,
  Screen,
} from '../common';
import { DEFAULT_PALETTE } from './default-palette';
import { createBrush, createFloodFill, createLine } from './sci0-screen-impl';
import { classicDitherer } from './ditherizer';

interface Buffer extends Screen {
  image: ImageLike;
}

const createBuffer = (empty: number): Buffer => {
  const buffer = new ArrayBuffer(320 * 190 * 4);

  const pixels = new Uint32Array(buffer, 0, 320 * 190);
  for (let i = 0; i < pixels.length; i++) pixels[i] = empty;

  const plot: Plotter = (pos: vec2, color: number) => {
    const [x, y] = pos;
    pixels[320 * y + x] = 0xff000000 | color;
  };

  const isFillable: IsFillable = (x, y) => pixels[x + y * 320] === empty;

  return {
    plot,
    brush: createBrush(plot, [320, 190]),
    fill: createFloodFill(plot, isFillable, [320, 190]),
    line: createLine(plot),
    image: {
      data: new Uint8ClampedArray(buffer),
      width: 320,
      height: 190,
    },
  };
};

const DEFAULT_PIPELINE = [classicDitherer];

interface RenderOptions {
  forcePal?: 0 | 1 | 2 | 3 | undefined;
  pipeline?: ImageFilter[];
}

interface RenderResult {
  visible: ImageLike;
  priority: ImageLike;
  control: ImageLike;
}

export const renderPic = (
  commands: DrawCommand[],
  options: RenderOptions = {},
): RenderResult => {
  const { forcePal } = options;

  const visible = createBuffer(0xff0000ff);
  const priority = createBuffer(0xff000000);
  const control = createBuffer(0xff000000);

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

  const { pipeline = DEFAULT_PIPELINE } = options;

  return {
    visible: pipeline.reduce((prev, filter) => filter(prev), visible.image),
    priority: priority.image,
    control: control.image,
  };
};
