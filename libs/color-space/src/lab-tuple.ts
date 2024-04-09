import { formatFloat as fmt } from './utils/format-float';
import { alphaPart as fmtA } from './utils/alpha-fns';
import { createColorPredicate } from './utils/create-color-predicate';

export type LabTuple = [
  'CIELAB' | 'CIE-L*a*b*',
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

export const isLabTuple = createColorPredicate<LabTuple>(
  'isLabTuple',
  ['CIELAB', 'CIE-L*a*b*'],
  [0, 100],
  [-160, 160],
  [-160, 160],
);
