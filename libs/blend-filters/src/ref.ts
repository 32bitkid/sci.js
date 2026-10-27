import type { BlendMode } from './blend-modes.js';

const packRGB = (r: number, b: number, g: number): number =>
  ((r << 0) | (g << 8) | (b << 16) | 0xff000000) >>> 0;
const packRGBf = (r: number, b: number, g: number) =>
  packRGB(r * 255, g * 255, b * 255);

const unpackRGB = (p: number) => [
  (p >>> 0) & 0xff,
  (p >>> 8) & 0xff,
  (p >>> 16) & 0xff,
];
const unpackRGBf = (p: number) => unpackRGB(p).map((c) => c / 255);

export const reference: (fn: (a: number, b: number) => number) => BlendMode =
  (fn: (a: number, b: number) => number): BlendMode =>
  (a, b): number => {
    const [aF, bF] = [unpackRGBf(a), unpackRGBf(b)];
    return packRGBf(fn(aF[0], bF[0]), fn(aF[0], bF[0]), fn(aF[0], bF[0]));
  };
