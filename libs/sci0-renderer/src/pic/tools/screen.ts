import type { DrawMode, DrawCodes, Cel, PatternCode } from '@4bitlabs/sci0';
import type { ResolvedColors } from '../resolve-dither.js';

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
  patternCode: PatternCode,
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
  resolveDither(codes: DrawCodes): ResolvedColors;
}
