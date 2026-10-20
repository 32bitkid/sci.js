import type {
  BrushCommand,
  FillCommand,
  PolylineCommand,
  SetPaletteCommand,
  UpdatePaletteCommand,
  EmbeddedCelCommand,
  SetMonoPalette,
  SetMono1,
  SetMono2,
  ClearMono1,
  ClearMono2,
  SetPriorityBands,
} from './draw-commands.js';

export type DrawCommand =
  | BrushCommand
  | FillCommand
  | PolylineCommand
  | SetPaletteCommand
  | UpdatePaletteCommand
  | EmbeddedCelCommand
  | SetMonoPalette
  | SetMono1
  | SetMono2
  | ClearMono1
  | ClearMono2
  | SetPriorityBands;
