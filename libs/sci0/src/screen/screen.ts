import { vec2 } from 'gl-matrix';

export type Plotter = (x: number, y: number, color: number) => void;

export type IsFillable = (x: number, y: number) => boolean;

export type Filler = (x: number, y: number, color: number) => void;

export type Liner = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number,
) => void;

export type Brusher = (
  cx: number,
  cy: number,
  size: number,
  isRect: boolean,
  isSpray: boolean,
  textureCode: number,
  color: number,
) => void;

export interface Screen {
  brush: Brusher;
  fill: Filler;
  line: Liner;
  plot: Plotter;
}
