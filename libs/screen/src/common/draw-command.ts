import { vec2 } from 'gl-matrix';
import { Cel } from './cel';

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
  drawMode: DrawMode,
  drawCodes: DrawCodes,
  patternCode: PatternCode,
  textureCode: number,
  pos: vec2,
];

type FillCommand = [
  mode: 'FILL',
  drawMode: DrawMode,
  drawCodes: DrawCodes,
  pos: vec2,
];

type PolylineCommand = [
  mode: 'PLINE',
  drawMode: DrawMode,
  drawCodes: DrawCodes,
  ...points: vec2[]
];

type EmbeddedCelCommand = [
  mode: 'CEL',
  drawMode: DrawMode,
  pos: vec2,
  cel: Cel,
];

export type DrawCommand =
  | BrushCommand
  | FillCommand
  | PolylineCommand
  | SetPaletteCommand
  | EmbeddedCelCommand;
