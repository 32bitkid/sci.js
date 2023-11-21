import { vec2 } from 'gl-matrix';

export type Plotter = (pos: vec2, color: number) => void;

export type IsFillable = (x: number, y: number) => boolean;

export type Filler = (pos: vec2, color: number) => void;
export type Liner = (a: vec2, b: vec2, color: number) => void;
export type Brusher = (
  center: vec2,
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
