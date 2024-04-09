import { type XYZTuple } from './xyz-tuple';
import { type LabTuple, create as createLab } from './lab-tuple';
import { D65 } from './d65-reference-values';
import { lerp } from './utils/lerp';
import { assign } from './utils/assign-values';
export { deltaE } from './lab-delta-e';

export function toXYZ(lab: LabTuple, out: XYZTuple = ['CIE-XYZ', 0, 0, 0]) {
  const [, l, a, b, alpha] = lab;
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  x = x ** 3 > 0.008856 ? x ** 3 : (x - 16 / 116) / 7.787;
  y = y ** 3 > 0.008856 ? y ** 3 : (y - 16 / 116) / 7.787;
  z = z ** 3 > 0.008856 ? z ** 3 : (z - 16 / 116) / 7.787;

  x *= D65[0];
  y *= D65[1];
  z *= D65[2];

  return assign(out, x, y, z, alpha);
}

export const lighten = (
  [, L, a, b, alpha]: LabTuple,
  amount: number,
  out: LabTuple = createLab(),
): LabTuple =>
  assign(
    out,
    lerp(L, 100, amount),
    lerp(a, 0, amount),
    lerp(b, 0, amount),
    alpha,
  );

export const darken = (
  [, L, a, b, alpha]: LabTuple,
  amount: number,
  out: LabTuple = createLab(),
): LabTuple =>
  assign(
    out,
    lerp(L, 0, amount),
    lerp(a, 0, amount),
    lerp(b, 0, amount),
    alpha,
  );

export const mix = (
  c1: LabTuple,
  c2: LabTuple,
  bias: number,
  out: LabTuple = createLab(),
): LabTuple => {
  const [, c1L, c1a, c1b, c1alpha] = c1;
  const [, c2L, c2a, c2b, c2alpha] = c2;

  const L = lerp(c1L, c2L, bias);
  const a = lerp(c1a, c2a, bias);
  const b = lerp(c1b, c2b, bias);
  const alpha = !(c1alpha === undefined && c2alpha === undefined)
    ? lerp(c1alpha ?? 1.0, c2alpha ?? 1.0, bias)
    : undefined;

  return assign(out, L, a, b, alpha);
};
