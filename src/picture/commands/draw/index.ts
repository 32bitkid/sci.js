import Operation from '../../operations';

export interface LinesCommand {
  operation: Operation.Lines;
  points: [number, number][];
}

export const lines = (...points: [number, number][]): LinesCommand => ({
  operation: Operation.Lines,
  points,
});

export interface FillsCommand {
  operation: Operation.Fills;
  points: [number, number][];
}

export const fills = (...points: [number, number][]): FillsCommand => ({
  operation: Operation.Fills,
  points,
});

export interface PatternsCommand {
  operation: Operation.Patterns;
  points: [number, number, number?][];
}

export const patterns = (...points: [number, number, number?][]): PatternsCommand => {
  return { operation: Operation.Patterns, points };
};

export interface SetPatternCommand {
  operation: Operation.SetPattern;
  size: number;
  isRectangle: boolean;
  isSolid: boolean;
}

export const setPattern = (
  size: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
  isRectangle: boolean,
  isSolid: boolean,
): SetPatternCommand => ({
  operation: Operation.SetPattern,
  size,
  isRectangle,
  isSolid,
});
