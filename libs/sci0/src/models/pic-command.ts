import type {
  BrushCommand,
  FillCommand,
  PolylineCommand,
  SetPaletteCommand,
  UpdatePaletteCommand,
  EmbeddedCelCommand,
  SetMonoPaletteCommand,
  SetMonoCommand,
  SetMonoDirectCommand,
  ClearMonoCommand,
  ClearMonoDirectCommand,
  SetPriorityBandsCommand,
  SetVisualCommand,
  SetControl,
  SetPriorityCommand,
  ClearVisualCommand,
  ClearControlCommand,
  ClearPriorityCommand,
  SetPatternCommand,
} from './draw-commands.js';

export type PicStateCommand =
  | ClearControlCommand
  | ClearMonoCommand
  | ClearMonoDirectCommand
  | ClearPriorityCommand
  | ClearVisualCommand
  | SetControl
  | SetMonoCommand
  | SetMonoDirectCommand
  | SetMonoPaletteCommand
  | SetPaletteCommand
  | SetPatternCommand
  | SetPriorityBandsCommand
  | SetPriorityCommand
  | SetVisualCommand
  | UpdatePaletteCommand;

export type DrawCommand =
  | PolylineCommand
  | FillCommand
  | BrushCommand
  | EmbeddedCelCommand;

export type PicCommand = DrawCommand | PicStateCommand;
