import { type DrawCommand, DrawMode } from '@4bitlabs/sci0';
import type { PaletteSet } from '../pic/default-palettes.js';

export function resolveVisualPair(
  cmd: DrawCommand,
  palettes: PaletteSet,
  forcePal?: 0 | 1 | 2 | 3 | undefined,
): [number, number] | undefined {
  const [mode] = cmd;
  if (mode !== 'FILL' && mode !== 'PLINE' && mode !== 'BRUSH') {
    return undefined;
  }

  const [, [drawMode, drawCodes]] = cmd;
  if (!DrawMode.isVisualMode(drawMode)) return undefined;

  const pal = forcePal ?? (drawCodes[0] / 40) >>> 0;
  const palette = palettes[pal];
  const palIndex = (drawCodes[0] % 40) >>> 0;
  const color = palette[palIndex];
  if (color === undefined)
    throw new Error(`palIndex(${palette}) is out of range`);

  const [leftIdx, rightIdx] = [color & 0b1111, (color >>> 4) & 0b1111];
  return [leftIdx, rightIdx];
}

export function resolvePriorityVal(cmd: DrawCommand): number | undefined {
  const [mode] = cmd;
  if (mode !== 'FILL' && mode !== 'PLINE' && mode !== 'BRUSH') {
    return undefined;
  }

  const [, [drawMode, drawCodes]] = cmd;
  if (!DrawMode.isPriorityMode(drawMode)) return undefined;

  return drawCodes[1];
}

export function resolveControlVal(cmd: DrawCommand): number | undefined {
  const [mode] = cmd;
  if (mode !== 'FILL' && mode !== 'PLINE' && mode !== 'BRUSH') {
    return undefined;
  }

  const [, [drawMode, drawCodes]] = cmd;
  if (!DrawMode.isControlMode(drawMode)) return undefined;

  return drawCodes[2];
}

export interface ResolvedColors {
  visualPair: [number, number] | undefined;
  priority: number | undefined;
  control: number | undefined;
}

export function resolveColors(
  cmd: DrawCommand,
  palettes: PaletteSet,
  forcePal?: 0 | 1 | 2 | 3 | undefined,
): ResolvedColors {
  return {
    visualPair: resolveVisualPair(cmd, palettes, forcePal),
    priority: resolvePriorityVal(cmd),
    control: resolveControlVal(cmd),
  };
}
