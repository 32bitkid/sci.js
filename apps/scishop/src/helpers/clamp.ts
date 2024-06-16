export const clamp = (x: number, lower: number = 0, upper: number = 1) =>
  Math.max(Math.min(x, upper), lower);
