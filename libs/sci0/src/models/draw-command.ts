import { Cel } from './cel';
import { StaticVec2 } from './vec2';

export enum DrawMode {
  Visual = 0b001,
  Priority = 0b010,
  Control = 0b100,
}

export const isVisualMode = (mode: DrawMode) =>
  ((mode & DrawMode.Visual) as DrawMode) === DrawMode.Visual;

export const isPriorityMode = (mode: DrawMode) =>
  ((mode & DrawMode.Priority) as DrawMode) === DrawMode.Priority;

export const isControlMode = (mode: DrawMode) =>
  ((mode & DrawMode.Control) as DrawMode) === DrawMode.Control;

export type PatternCode = readonly [
  size: number,
  isRect: boolean,
  isSpray: boolean,
];

export type DrawCodes = readonly [
  visual: number,
  priority: number,
  control: number,
];

export type SetPaletteCommand = readonly [
  mode: 'SET_PALETTE',
  pal: number,
  colors: Uint8Array,
];

export type UpdatePaletteCommand = readonly [
  mode: 'UPDATE_PALETTE',
  entries: [pal: number, idx: number, color: number][],
];

export type BrushCommand = readonly [
  mode: 'BRUSH',
  drawMode: DrawMode,
  drawCodes: DrawCodes,
  patternCode: PatternCode,
  textureCode: number,
  pos: StaticVec2,
];

export type FillCommand = readonly [
  mode: 'FILL',
  drawMode: DrawMode,
  drawCodes: DrawCodes,
  pos: StaticVec2,
];

export type PolylineCommand = readonly [
  mode: 'PLINE',
  drawMode: DrawMode,
  drawCodes: DrawCodes,
  ...points: StaticVec2[],
];

export type EmbeddedCelCommand = readonly [
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
