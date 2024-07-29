export const scalarLerp = (a: number, b: number, t: number): number =>
  a * (1 - t) + b * t;
