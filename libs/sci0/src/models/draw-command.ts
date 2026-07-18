import type {
  BrushCommand,
  FillCommand,
  PolylineCommand,
  SetPaletteCommand,
  UpdatePaletteCommand,
  EmbeddedCelCommand,
} from './draw-commands.js';

export type DrawCommand =
  | BrushCommand
  | FillCommand
  | PolylineCommand
  | SetPaletteCommand
  | UpdatePaletteCommand
  | EmbeddedCelCommand;
