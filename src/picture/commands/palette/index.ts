import Operation from '../../operations';

export interface UpdatePaletteCommand {
  operation: Operation.UpdatePalette;
  entries: { palette: number; index: number; color: number }[];
}

export const updatePalette = (
  ...entries: { palette: number; index: number; color: number }[]
): UpdatePaletteCommand => ({
  operation: Operation.UpdatePalette,
  entries,
});

export interface SetPaletteCommand {
  operation: Operation.SetPalette;
  palette: number;
  colors: number[];
}

export const setPalette = (palette: number, colors: number[]): SetPaletteCommand => ({
  operation: Operation.SetPalette,
  palette,
  colors,
});
