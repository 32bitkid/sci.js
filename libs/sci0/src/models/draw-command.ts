import { Cel } from './cel';
import { StaticVec2 } from './vec2';

export enum DrawMode {
  Visual = 1 << 0,
  Priority = 1 << 1,
  Control = 1 << 2,
}

export type PatternCode = [size: number, isRect: boolean, isSpray: boolean];
export type DrawCodes = [visual: number, priority: number, control: number];

type SetPaletteCommand = [mode: 'SET_PALETTE', pal: number, colors: Uint8Array];

type UpdatePaletteCommand = [
  mode: 'UPDATE_PALETTE',
  entries: [pal: number, idx: number, color: number][],
];

type BrushCommand = [
  mode: 'BRUSH',
  drawMode: DrawMode,
  drawCodes: DrawCodes,
  patternCode: PatternCode,
  textureCode: number,
  pos: StaticVec2,
];

type FillCommand = [
  mode: 'FILL',
  drawMode: DrawMode,
  drawCodes: DrawCodes,
  pos: StaticVec2,
];

type PolylineCommand = [
  mode: 'PLINE',
  drawMode: DrawMode,
  drawCodes: DrawCodes,
  ...points: StaticVec2[],
];

type EmbeddedCelCommand = [
  mode: 'CEL',
  drawMode: DrawMode,
  pos: StaticVec2,
  cel: Cel,
];

export type DrawCommand =
  | BrushCommand
  | FillCommand
  | PolylineCommand
  | SetPaletteCommand
  | UpdatePaletteCommand
  | EmbeddedCelCommand;
