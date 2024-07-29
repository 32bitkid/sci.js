import type { Vec2 } from '@4bitlabs/vec2';
import { Cel } from './cel';
import { DrawMode } from './draw-mode';
import { DrawCodes } from './draw-codes';
import { PatternCode } from './pattern-code';

export type SetPaletteCommand = ['SET_PALETTE', [pal: number], ...number[]];

export type UpdatePaletteCommand = [
  'UPDATE_PALETTE',
  [],
  ...[pal: number, idx: number, color: number][],
];

export type BrushCommand = [
  'BRUSH',
  [
    drawMode: DrawMode,
    drawCodes: DrawCodes,
    ...patternCode: PatternCode,
    textureCode: number,
  ],
  Vec2,
];

export type FillCommand = [
  'FILL',
  [drawMode: DrawMode, drawCodes: DrawCodes],
  Vec2,
];

export type PolylineCommand = [
  'PLINE',
  [drawMode: DrawMode, drawCodes: DrawCodes],
  ...Vec2[],
];

export type EmbeddedCelCommand = [
  'CEL',
  [drawMode: DrawMode],
  pos: Vec2,
  cel: Cel,
];
