import { type XYZTuple } from './xyz-tuple';
import { type LabTuple, create as createLab } from './lab-tuple';
import { D50 } from './reference-white';
import { lerp } from './utils/lerp';
import { assign } from './utils/assign-values';
export { deltaE } from './lab-delta-e';

const ϵ = 216 / 24389; // 6^3/29^3
const κ = 24389 / 27; // 29^3/3^3

// prettier-ignore
const BRADFORD_Mb = Float64Array.of(
   0.9555766, -0.0230393,  0.0631636,
  -0.0282895,  1.0099416,  0.0210077,
   0.0122982, -0.0204830,  1.3299098,
)

export function toXYZ(lab: LabTuple, out: XYZTuple = ['CIE-XYZ', 0, 0, 0]) {
  const [, L, a, b, alpha] = lab;
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const fx3 = fx ** 3;
  const fz3 = fz ** 3;

  const xr = fx3 > ϵ ? fx3 : (116 * fx - 16) / κ;
  const yr = L > κ * ϵ ? fy ** 3 : L / κ;
  const zr = fz3 > ϵ ? fz3 : (116 * fz - 16) / κ;

  const [refX, refY, refZ] = D50;
  const xD50 = xr * refX;
  const yD50 = yr * refY;
  const zD50 = zr * refZ;

  const x =
    xD50 * BRADFORD_Mb[0] + yD50 * BRADFORD_Mb[1] + zD50 * BRADFORD_Mb[2];
  const y =
    xD50 * BRADFORD_Mb[3] + yD50 * BRADFORD_Mb[4] + zD50 * BRADFORD_Mb[5];
  const z =
    xD50 * BRADFORD_Mb[6] + yD50 * BRADFORD_Mb[7] + zD50 * BRADFORD_Mb[8];

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
