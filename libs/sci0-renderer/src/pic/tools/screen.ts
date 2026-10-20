import type { DrawMode, DrawCodes, Cel, DrawCommand } from '@4bitlabs/sci0';
import type { ResolvedColors } from '../../helpers/resolve-colors.js';
import type { PaletteSet } from '../default-palettes.js';

export type RawPlotter = (x: number, y: number, color: number) => void;

export type Plotter = (
  x: number,
  y: number,
  drawMode: DrawMode,
  drawCodes: DrawCodes,
) => void;

export type IsFillable = (x: number, y: number, drawMode: DrawMode) => boolean;

export type Filler = (
  x: number,
  y: number,
  drawMode: DrawMode,
  drawCodes: DrawCodes,
) => void;

export type Liner = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  drawMode: DrawMode,
  drawCodes: DrawCodes,
) => void;

export type Brusher = (
  cx: number,
  cy: number,
  drawMode: DrawMode,
  drawCodes: DrawCodes,
  size: number,
  isRect: boolean,
  isSpray: boolean,
  textureCode: number,
) => void;

export type Blitter = (
  x: number,
  y: number,
  drawMode: DrawMode,
  cel: Cel,
) => void;

export interface Screen {
  brush: Brusher;
  fill: Filler;
  line: Liner;
  blit: Blitter;
  setPalette(pal: number, values: number[]): void;
  updatePalette(entries: [pal: number, idx: number, value: number][]): void;
  resolveColor(
    cmd: DrawCommand,
    forcePal?: 0 | 1 | 2 | 3 | undefined,
  ): ResolvedColors;

  /** @deprecated do not use */
  get palettes(): PaletteSet;
}
