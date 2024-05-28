import {
  BrushCommand,
  DrawCommand,
  EmbeddedCelCommand,
  FillCommand,
  PolylineCommand,
  SetPaletteCommand,
  UpdatePaletteCommand,
} from '@4bitlabs/sci0';

export type BasicEditorCommand<T extends DrawCommand> = {
  readonly id: symbol | number | string;
  readonly type: T[0];
  readonly name?: string;
  readonly commands: [T];
};

export type CompositeEditorCommand<T extends string> = {
  readonly id: symbol | number | string;
  readonly type: T;
  readonly name?: string;
  readonly commands: (PolylineCommand | FillCommand | BrushCommand)[];
};

export type GroupEditorCommand = CompositeEditorCommand<'group'>;

export type EditorCommand =
  | GroupEditorCommand
  | BasicEditorCommand<SetPaletteCommand>
  | BasicEditorCommand<UpdatePaletteCommand>
  | BasicEditorCommand<PolylineCommand>
  | BasicEditorCommand<FillCommand>
  | BasicEditorCommand<BrushCommand>
  | BasicEditorCommand<EmbeddedCelCommand>;
