import { alphaPart as fmtA } from './utils/alpha-fns';
import { formatFloat as fmt } from './utils/format-float';

export type linearRGBTuple = [
  'linear-RGB',
  r: number,
  g: number,
  b: number,
  a?: number,
];

export const create = (
  r: number = 0,
  g: number = 0,
  b: number = 0,
  a?: number,
): linearRGBTuple =>
  a !== undefined ? ['linear-RGB', r, g, b, a] : ['linear-RGB', r, g, b];

export const toString = ([, r, g, b, alpha]: linearRGBTuple) =>
  `rgb(${fmt(r)} ${fmt(g)} ${fmt(b)}${fmtA(alpha)})`;
