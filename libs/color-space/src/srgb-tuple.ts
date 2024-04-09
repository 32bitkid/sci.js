import { alphaPart as fmtA } from './utils/alpha-fns';
import { formatFloat as fmt } from './utils/format-float';
import { createColorPredicate } from './utils/create-color-predicate';

export type sRGBTuple = ['sRGB', r: number, g: number, b: number, a?: number];

export const create = (
  r: number = 0,
  g: number = 0,
  b: number = 0,
  a?: number,
): sRGBTuple => (a !== undefined ? ['sRGB', r, g, b, a] : ['sRGB', r, g, b]);

export const toString = ([, r, g, b, alpha]: sRGBTuple) =>
  `rgb(${fmt(r)} ${fmt(g)} ${fmt(b)}${fmtA(alpha)})`;

export const isSRGBTuple = createColorPredicate<sRGBTuple>(
  'isSRGBTuple',
  ['sRGB'],
  [0, 255],
  [0, 255],
  [0, 255],
);
