import { type XYZColor, type sRGBColor, type LabColor } from './types';
import { D65 } from './d65-reference-values';
import { clamp } from '../utils/clamp';

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
