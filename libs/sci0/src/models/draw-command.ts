import type {
  BrushCommand,
  FillCommand,
  PolylineCommand,
  SetPaletteCommand,
  UpdatePaletteCommand,
  EmbeddedCelCommand,
} from './draw-commands';

export type DrawCommand =
  | BrushCommand
  | FillCommand
  | PolylineCommand
  | SetPaletteCommand
  | UpdatePaletteCommand
  | EmbeddedCelCommand;
