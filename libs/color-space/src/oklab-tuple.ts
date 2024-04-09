import { formatFloat as fmt } from './utils/format-float';
import { alphaPart as fmtA } from './utils/alpha-fns';

export type okLabTuple = ['okLab', L: number, a: number, b: number, a?: number];

export const create = (
  L: number = 0,
  a: number = 0,
  b: number = 0,
  alpha?: number,
): okLabTuple =>
  alpha !== undefined ? ['okLab', L, a, b, alpha] : ['okLab', L, a, b];

export const toString = ([, L, a, b, alpha]: okLabTuple) =>
  `oklab(${fmt(L)} ${fmt(a)} ${fmt(b)}${fmtA(alpha)})`;
