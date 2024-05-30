import { DrawCodes, DrawMode } from '../models/draw-command';
import { Cel } from '../models/cel';

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
  setPixel: RawPlotter;
  blit: Blitter;
}
