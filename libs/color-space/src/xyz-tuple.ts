import { formatFloat as fmt } from './utils/format-float';
import { alphaPart as fmtA } from './utils/alpha-fns';

export type XYZTuple = ['CIE-XYZ', x: number, y: number, z: number, a?: number];

export const create = (
  x: number = 0,
  y: number = 0,
  z: number = 0,
  a?: number,
): XYZTuple =>
  a !== undefined ? ['CIE-XYZ', x, y, z, a] : ['CIE-XYZ', x, y, z];

export const toString = ([, x, y, z, alpha]: XYZTuple) =>
  `color(xyz ${fmt(x / 100)} ${fmt(y / 100)} ${fmt(z / 100)}${fmtA(alpha)})`;
