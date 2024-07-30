import { DEFAULT_PALETTE } from './default-palette';

export type PaletteSet = [Uint8Array, Uint8Array, Uint8Array, Uint8Array];

export const defaultPalettes = (): PaletteSet => [
  Uint8Array.from(DEFAULT_PALETTE),
  Uint8Array.from(DEFAULT_PALETTE),
  Uint8Array.from(DEFAULT_PALETTE),
  Uint8Array.from(DEFAULT_PALETTE),
];
