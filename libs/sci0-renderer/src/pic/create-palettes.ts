import { DEFAULT_PALETTE } from './default-palette.js';

export type PaletteSet = [Uint8Array, Uint8Array, Uint8Array, Uint8Array];

export const createPalettes = (
  defaultPal: number[] = DEFAULT_PALETTE,
): PaletteSet => {
  const bytes = new ArrayBuffer(40 * 4);
  const pal0 = new Uint8Array(bytes, 0, 40);
  const pal1 = new Uint8Array(bytes, 40, 40);
  const pal2 = new Uint8Array(bytes, 80, 40);
  const pal3 = new Uint8Array(bytes, 120, 40);
  pal0.set(defaultPal, 0);
  pal1.set(defaultPal, 0);
  pal2.set(defaultPal, 0);
  pal3.set(defaultPal, 0);
  return [pal0, pal1, pal2, pal3];
};
