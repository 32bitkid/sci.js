import { vec2 } from 'gl-matrix';
import { DrawMode, DrawCodes, PatternCode } from './pic-state';

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
