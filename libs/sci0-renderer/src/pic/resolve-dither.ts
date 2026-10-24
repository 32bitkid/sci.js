import type { DrawCodes } from '@4bitlabs/sci0';
import type { PaletteSet } from './create-palettes.js';

export type ResolvedColors = [number, number];

export function resolveDither(
  drawCodes: DrawCodes,
  palettes: PaletteSet,
  forcePal?: 0 | 1 | 2 | 3 | undefined,
): ResolvedColors {
  const pal = forcePal ?? (drawCodes[0] / 40) >>> 0;
  const palette = palettes[pal];
  const palIndex = (drawCodes[0] % 40) >>> 0;
  const color = palette[palIndex];
  if (color === undefined)
    throw new Error(`palIndex(${palette}) is out of range`);

  const [leftIdx, rightIdx] = [color & 0b1111, (color >>> 4) & 0b1111];
  return [leftIdx, rightIdx];
}
