import {
  type XYZColor,
  type sRGBColor,
  type LabColor,
  type okLabColor,
} from './types';
import { D65 } from './d65-reference-values';
import { clamp } from '../utils/clamp';
import { lerp } from '../utils/lerp';

// prettier-ignore
const matrix = Float64Array.of(
   3.2404542, -1.5371385, -0.4985314,
  -0.9692660,  1.8760108,  0.0415560,
   0.0556434, -0.2040259,  1.0572252,
);

const gamma = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

export function toSRGB(
  xyz: XYZColor,
  out: sRGBColor = ['sRGB', 0, 0, 0],
): sRGBColor {
  const [, x, y, z, alpha] = xyz;
  const [X, Y, Z] = [x / 100, y / 100, z / 100];

  const rLinear = X * matrix[0] + Y * matrix[1] + Z * matrix[2];
  const gLinear = X * matrix[3] + Y * matrix[4] + Z * matrix[5];
  const bLinear = X * matrix[6] + Y * matrix[7] + Z * matrix[8];

  out[1] = clamp(Math.round(255 * gamma(rLinear)), 0, 255);
  out[2] = clamp(Math.round(255 * gamma(gLinear)), 0, 255);
  out[3] = clamp(Math.round(255 * gamma(bLinear)), 0, 255);
  out[4] = alpha;

  return out;
}

const EPSILON = 0.008856; // 216 / 24389

export function toLab(xyz: XYZColor, out: LabColor = ['CIE-L*a*b*', 0, 0, 0]) {
  const [, x, y, z, alpha] = xyz;

  const [x1, y1, z1] = [x, y, z].map((v, i) => {
    v = v / D65[i];
    v = v > EPSILON ? v ** (1 / 3) : v * 7.787 + 16 / 116;
    return v;
  });

  out[1] = 116 * y1 - 16;
  out[2] = 500 * (x1 - y1);
  out[3] = 200 * (y1 - z1);
  out[4] = alpha;

  return out;
}

// prettier-ignore
const OKLAB_M1 = Float64Array.of(
  0.8190224432164319,   0.3619062562801221, -0.12887378261216414,
  0.0329836671980271,   0.9292868468965546,  0.03614466816999844,
  0.048177199566046255, 0.26423952494422764, 0.6335478258136937,
);

// prettier-ignore
const OKLAB_M2 = Float64Array.of(
  0.2104542553,   0.7936177850,  -0.0040720468,
  1.9779984951,  -2.4285922050,   0.4505937099,
  0.0259040371,   0.7827717662,  -0.8086757660,
)

// see https://bottosson.github.io/posts/oklab/
export function toOkLab(
  xyz: XYZColor,
  out: okLabColor = ['okLab', 0, 0, 0],
): okLabColor {
  const [x, y, z, alpha] = [xyz[1] / 100, xyz[2] / 100, xyz[3] / 100, xyz[4]];

  const l = x * OKLAB_M1[0] + y * OKLAB_M1[1] + z * OKLAB_M1[2];
  const m = x * OKLAB_M1[3] + y * OKLAB_M1[4] + z * OKLAB_M1[5];
  const s = x * OKLAB_M1[6] + y * OKLAB_M1[7] + z * OKLAB_M1[8];

  const l$ = Math.cbrt(l);
  const m$ = Math.cbrt(m);
  const s$ = Math.cbrt(s);

  out[1] = l$ * OKLAB_M2[0] + m$ * OKLAB_M2[1] + s$ * OKLAB_M2[2];
  out[2] = l$ * OKLAB_M2[3] + m$ * OKLAB_M2[4] + s$ * OKLAB_M2[5];
  out[3] = l$ * OKLAB_M2[6] + m$ * OKLAB_M2[7] + s$ * OKLAB_M2[8];
  out[4] = alpha;

  return out;
}

export const mix = (c1: XYZColor, c2: XYZColor, bias: number): XYZColor => {
  const [, c1x, c1y, c1z, c1alpha] = c1;
  const [, c2x, c2y, c2z, c2alpha] = c2;

  const alpha = !(c1alpha === undefined && c2alpha === undefined)
    ? ([lerp(c1alpha ?? 1.0, c2alpha ?? 1.0, bias)] as const)
    : ([] as const);

  return [
    'CIE-XYZ',
    lerp(c1x, c2x, bias),
    lerp(c1y, c2y, bias),
    lerp(c1z, c2z, bias),
    ...alpha,
  ];
};
