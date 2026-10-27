import { reference } from './ref.js';

/**
 * @param a base layer RGBA pixel
 * @param b blend layer RGBA pixel
 * @returns the resulting RGBA pixel
 */
export type BlendMode = (a: number, b: number) => number;

export const multiply = (a: number, b: number): number => {
  const [aR, aG, aB] = [(a >>> 0) & 0xff, (a >>> 8) & 0xff, (a >>> 16) & 0xff];
  const [bR, bG, bB] = [(b >>> 0) & 0xff, (b >>> 8) & 0xff, (b >>> 16) & 0xff];
  const [dR, dG, dB] = [
    Math.imul(aR, bR) / 255,
    Math.imul(aG, bG) / 255,
    Math.imul(aB, bB) / 255,
  ];
  return (0xff000000 | (dB << 16) | (dG << 8) | (dR << 0)) >>> 0;
};

export const screen = (a: number, b: number): number => {
  const [aR, aG, aB] = [(a >>> 0) & 0xff, (a >>> 8) & 0xff, (a >>> 16) & 0xff];
  const [bR, bG, bB] = [(b >>> 0) & 0xff, (b >>> 8) & 0xff, (b >>> 16) & 0xff];
  const [dR, dG, dB] = [
    255 - Math.imul(255 - aR, 255 - bR) / 255,
    255 - Math.imul(255 - aG, 255 - bG) / 255,
    255 - Math.imul(255 - aB, 255 - bB) / 255,
  ];
  return (0xff000000 | (dB << 16) | (dG << 8) | (dR << 0)) >>> 0;
};

export const overlay = (a: number, b: number): number => {
  const [aR, aG, aB] = [(a >>> 0) & 0xff, (a >>> 8) & 0xff, (a >>> 16) & 0xff];
  const [bR, bG, bB] = [(b >>> 0) & 0xff, (b >>> 8) & 0xff, (b >>> 16) & 0xff];

  const [dR, dG, dB] = [
    aR < 0.5
      ? Math.imul(2, Math.imul(aR, bR))
      : 255 - (2 * Math.imul(255 - aR, 255 - bR)) / 255,
    aG < 0.5
      ? Math.imul(2, Math.imul(aG, bG))
      : 255 - (2 * Math.imul(255 - aG, 255 - bG)) / 255,
    aB < 0.5
      ? Math.imul(2, Math.imul(aB, bB))
      : 255 - (2 * Math.imul(255 - aB, 255 - bB)) / 255,
  ];

  return (0xff000000 | (dB << 16) | (dG << 8) | (dR << 0)) >>> 0;
};

export const hardLight = (a: number, b: number): number => {
  const [aR, aG, aB] = [(a >>> 0) & 0xff, (a >>> 8) & 0xff, (a >>> 16) & 0xff];
  const [bR, bG, bB] = [(b >>> 0) & 0xff, (b >>> 8) & 0xff, (b >>> 16) & 0xff];

  const [dR, dG, dB] = [
    bR < 0.5
      ? Math.imul(2, Math.imul(aR, bR))
      : 255 - (2 * Math.imul(255 - aR, 255 - bR)) / 255,
    bG < 0.5
      ? Math.imul(2, Math.imul(aG, bG))
      : 255 - (2 * Math.imul(255 - aG, 255 - bG)) / 255,
    bB < 0.5
      ? Math.imul(2, Math.imul(aB, bB))
      : 255 - (2 * Math.imul(255 - aB, 255 - bB)) / 255,
  ];

  return (0xff000000 | (dB << 16) | (dG << 8) | (dR << 0)) >>> 0;
};

export const softLight: BlendMode = reference(
  (a, b) => (1 - 2 * b) * a ** 2 + 2 * b * a,
);

export const lightenOnly = (a: number, b: number): number => {
  const [aR, aG, aB] = [(a >>> 0) & 0xff, (a >>> 8) & 0xff, (a >>> 16) & 0xff];
  const [bR, bG, bB] = [(b >>> 0) & 0xff, (b >>> 8) & 0xff, (b >>> 16) & 0xff];
  const [dR, dG, dB] = [Math.max(aR, bR), Math.max(aG, bG), Math.max(aB, bB)];
  return (0xff000000 | (dB << 16) | (dG << 8) | (dR << 0)) >>> 0;
};

export const darkenOnly = (a: number, b: number): number => {
  const [aR, aG, aB] = [(a >>> 0) & 0xff, (a >>> 8) & 0xff, (a >>> 16) & 0xff];
  const [bR, bG, bB] = [(b >>> 0) & 0xff, (b >>> 8) & 0xff, (b >>> 16) & 0xff];
  const [dR, dG, dB] = [Math.min(aR, bR), Math.min(aG, bG), Math.min(aB, bB)];
  return (0xff000000 | (dB << 16) | (dG << 8) | (dR << 0)) >>> 0;
};
