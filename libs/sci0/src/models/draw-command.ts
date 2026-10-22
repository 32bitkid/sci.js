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

export type DrawCommand =
  | BrushCommand
  | FillCommand
  | PolylineCommand
  | SetPaletteCommand
  | UpdatePaletteCommand
  | EmbeddedCelCommand
  | SetMonoPaletteCommand
  | SetMonoCommand
  | SetMonoDirectCommand
  | ClearMonoCommand
  | ClearMonoDirectCommand
  | SetPriorityBandsCommand
  | SetVisualCommand
  | SetControl
  | SetPriorityCommand
  | ClearVisualCommand
  | ClearControlCommand
  | ClearPriorityCommand
  | SetPatternCommand;
