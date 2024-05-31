import { clamp } from './clamp.ts';

export const s0 = (left: number, right: number, val: number) =>
  clamp((val - left) / (right - left));

export const s1 = (left: number, right: number, val: number) => {
  const x = clamp((val - left) / (right - left));
  return x ** 2 * (-2.0 * x + 3.0);
};

export const s2 = (left: number, right: number, val: number) => {
  const x = clamp((val - left) / (right - left));
  return x ** 3 * (6 * x ** 2 - 15 * x + 10);
};

export const s3 = (left: number, right: number, val: number) => {
  const x = clamp((val - left) / (right - left));
  return -20 * x ** 7 + 70 * x ** 6 + -84 * x ** 5 + 35 * x ** 4;
};
