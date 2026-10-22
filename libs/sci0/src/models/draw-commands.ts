import type { Vec2 } from '@4bitlabs/vec2';
import type { Cel } from './cel.js';

export type SetPaletteCommand = ['SET_PALETTE', pal: number, ...number[]];

export type UpdatePaletteCommand = [
  'UPDATE_PALETTE',
  ...[pal: number, idx: number, color: number][],
];

export type SetPatternCommand = [
  'SET_PATTERN',
  size: number,
  rect: boolean,
  spray: boolean,
];

export type BrushCommand = ['BRUSH', textureCode: number, Vec2];

export type FillCommand = ['FILL', Vec2];

export type PolylineCommand = ['PLINE', ...Vec2[]];

export type EmbeddedCelCommand = ['CEL', pos: Vec2, cel: Cel];

export type SetMonoPaletteCommand = [
  'SET_MONO_PALETTE',
  pal: number,
  ...number[],
];
export type SetMonoCommand = ['SET_MONO', value: number];
export type SetMonoDirectCommand = ['SET_MONO_DIRECT', value: number];
export type ClearMonoCommand = ['CLEAR_MONO'];
export type ClearMonoDirectCommand = ['CLEAR_MONO_DIRECT'];
export type SetPriorityBandsCommand = ['SET_PRIORITY_BANDS', ...number[]];

export type SetVisualCommand = ['SET_VISUAL', code: number];
export type SetControl = ['SET_CONTROL', code: number];
export type SetPriorityCommand = ['SET_PRIORITY', code: number];

export type ClearVisualCommand = ['CLEAR_VISUAL'];
export type ClearControlCommand = ['CLEAR_CONTROL'];
export type ClearPriorityCommand = ['CLEAR_PRIORITY'];
