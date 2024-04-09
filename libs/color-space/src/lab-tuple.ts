import { formatFloat as fmt } from './utils/format-float';
import { alphaPart as fmtA } from './utils/alpha-fns';

export type LabTuple = [
  'CIE-L*a*b*',
  L: number,
  a: number,
  b: number,
  a?: number,
];

export const create = (
  L: number = 0,
  a: number = 0,
  b: number = 0,
  alpha?: number,
): LabTuple =>
  alpha !== undefined
    ? ['CIE-L*a*b*', L, a, b, alpha]
    : ['CIE-L*a*b*', L, a, b];

export const toString = ([, L, a, b, alpha]: LabTuple) =>
  `lab(${fmt(L)} ${fmt(a)} ${fmt(b)}${fmtA(alpha)})`;
