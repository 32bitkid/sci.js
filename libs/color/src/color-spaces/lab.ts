import { type XYZColor, type LabColor } from './types';
import { D65 } from './d65-reference-values';
import { lerp } from '../utils/lerp';

export function toXYZ(lab: LabColor, out: XYZColor = ['CIE-XYZ', 0, 0, 0]) {
  const [, l, a, b, alpha] = lab;
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  [x, y, z] = [x, y, z].map((v) => {
    return v ** 3 > 0.008856 ? v ** 3 : (v - 16 / 116) / 7.787;
  });

  out[1] = x * D65[0];
  out[2] = y * D65[1];
  out[3] = z * D65[2];
  out[4] = alpha;

  return out;
}

export const lighten = (
  [, L, a, b, alpha]: LabColor,
  amount: number,
): LabColor => [
  'CIE-L*a*b*',
  lerp(L, 100, amount),
  lerp(a, 0, amount),
  lerp(b, 0, amount),
  alpha,
];

export const darken = (
  [, L, a, b, alpha]: LabColor,
  amount: number,
): LabColor => [
  'CIE-L*a*b*',
  lerp(L, 0, amount),
  lerp(a, 0, amount),
  lerp(b, 0, amount),
  alpha,
];

export const mix = (c1: LabColor, c2: LabColor, bias: number): LabColor => {
  const [, c1L, c1a, c1b, c1alpha] = c1;
  const [, c2L, c2a, c2b, c2alpha] = c2;

  const alpha = !(c1alpha === undefined && c2alpha === undefined)
    ? ([lerp(c1alpha ?? 1.0, c2alpha ?? 1.0, bias)] as const)
    : ([] as const);

  return [
    'CIE-L*a*b*',
    lerp(c1L, c2L, bias),
    lerp(c1a, c2a, bias),
    lerp(c1b, c2b, bias),
    ...alpha,
  ];
};
