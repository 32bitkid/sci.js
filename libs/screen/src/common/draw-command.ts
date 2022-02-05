import { vec2 } from 'gl-matrix';

export enum DrawMode {
  Visual = 1 << 0,
  Priority = 1 << 1,
  Control = 1 << 2,
}

export type PatternCode = [size: number, isRect: boolean, isSpray: boolean];
export type DrawCodes = [visual: number, priority: number, control: number];

type SetPaletteCommand = [
  mode: 'SET_PALETTE',
  idx: number,
  palette: Uint8Array,
];

type BrushCommand = [
  mode: 'BRUSH',
  drawFlag: DrawMode,
  drawCodes: DrawCodes,
  patternCode: PatternCode,
  textureCode: number,
  pos: vec2,
];

type FillCommand = [
  mode: 'FILL',
  drawFlag: DrawMode,
  drawCodes: DrawCodes,
  pos: vec2,
];

type PolylineCommand = [
  mode: 'PLINE',
  drawFlag: DrawMode,
  drawCodes: DrawCodes,
  ...points: vec2[]
];

export type DrawCommand =
  | BrushCommand
  | FillCommand
  | PolylineCommand
  | SetPaletteCommand;
