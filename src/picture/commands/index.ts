import Operation from '../operations';

import * as Layer from './layer';
import * as Draw from './draw';
import * as Palette from './palette';

export type Command =
  | DoneCommand
  | Layer.SetCommand
  | Layer.DisableCommand
  | Draw.LinesCommand
  | Draw.PatternsCommand
  | Draw.FillsCommand
  | Draw.SetPatternCommand
  | Palette.SetPaletteCommand
  | Palette.UpdatePaletteCommand;

interface DoneCommand {
  operation: Operation.Done;
}

export const done = (): Command => ({ operation: Operation.Done });

export { Layer, Draw, Palette };
