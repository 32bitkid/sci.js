import { type Vec2 } from '@4bitlabs/vec2';
import { Cel } from './cel';

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

export type DrawCommandStruct<
  Type extends string,
  Options,
  Payload extends unknown[] = [],
> = readonly [type: Type, options: Options, ...Payload];

export type SetPalettePayload = number[];
export type SetPaletteCommand = DrawCommandStruct<
  'SET_PALETTE',
  [pal: number],
  SetPalettePayload
>;

export type UpdatePaletteEntry = [pal: number, idx: number, color: number];
export type UpdatePalettePayload = UpdatePaletteEntry[];
export type UpdatePaletteCommand = DrawCommandStruct<
  'UPDATE_PALETTE',
  [],
  UpdatePalettePayload
>;

export type BrushCommand = DrawCommandStruct<
  'BRUSH',
  [
    drawMode: DrawMode,
    drawCodes: DrawCodes,
    ...patternCode: PatternCode,
    textureCode: number,
  ],
  [Vec2]
>;

export type FillCommand = DrawCommandStruct<
  'FILL',
  [drawMode: DrawMode, drawCodes: DrawCodes],
  [Vec2]
>;

export type PolylineCommand = DrawCommandStruct<
  'PLINE',
  [drawMode: DrawMode, drawCodes: DrawCodes],
  Vec2[]
>;

export type EmbeddedCelPayload = [pos: Vec2, cel: Cel];
export type EmbeddedCelCommand = DrawCommandStruct<
  'CEL',
  [drawMode: DrawMode],
  EmbeddedCelPayload
>;

export type DrawCommand =
  | BrushCommand
  | FillCommand
  | PolylineCommand
  | SetPaletteCommand
  | UpdatePaletteCommand
  | EmbeddedCelCommand;
