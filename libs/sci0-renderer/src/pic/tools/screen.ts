import type { Cel, PicState } from '@4bitlabs/sci0';
import type { ResolvedColors } from '../resolve-dither.js';

export type RawPlotter = (x: number, y: number, color: number) => void;

export type Plotter = (state: Readonly<PicState>, x: number, y: number) => void;

export type IsFillable = (
  state: Readonly<PicState>,
  x: number,
  y: number,
) => boolean;

export type Filler = (state: Readonly<PicState>, x: number, y: number) => void;

export type Liner = (
  state: Readonly<PicState>,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) => void;

export type Brusher = (
  state: Readonly<PicState>,
  cx: number,
  cy: number,
  textureCode: number,
) => void;

export type Blitter = (
  state: Readonly<PicState>,
  x: number,
  y: number,
  cel: Cel,
) => void;

export interface Screen {
  brush: Brusher;
  fill: Filler;
  line: Liner;
  blit: Blitter;
  resolveDither(state: PicState): ResolvedColors;
}
