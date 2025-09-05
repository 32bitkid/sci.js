import { type XYZTuple, create as createXYZ } from '../tuples/xyz-tuple';
import { type sRGBTuple, create as createSRGB } from '../tuples/srgb-tuple';
import { type LabTuple, create as createLab } from '../tuples/lab-tuple';
import { type okLabTuple, create as createOkLab } from '../tuples/oklab-tuple';
import { D50 } from '../reference-white';
import { clamp } from '../utils/clamp';
import { lerp } from '../utils/lerp';
import { assign } from '../utils/assign-values';

// biome-ignore format: matrix
const matrix = Float64Array.of(
  // Lindbloom
  //  3.2404542, -1.5371385, -0.4985314,
  // -0.9692660,  1.8760108,  0.0415560,
  //  0.0556434, -0.2040259,  1.0572252,

  // IEC 61966-2-1:1999
  //  3.24096994,  -1.53738318,  -0.49861076,
  // -0.96924364,   1.87596750,   0.04155506,
  //  0.05563008,  -0.20397696,   1.05697151,

   3.2409699419045226,  -1.537383177570094,   -0.4986107602930034,
  -0.9692436362808796,   1.8759675015077202,   0.04155505740717559,
   0.05563007969699366, -0.20397695888897652,  1.0569715142428786
);

const gamma = (c: number) =>
  c > 0.0031308 ? 1.055 * c ** (1 / 2.4) - 0.055 : 12.92 * c;

export function toSRGB(
  xyz: XYZTuple,
  out: sRGBTuple = createSRGB(),
): sRGBTuple {
  const [, x, y, z, alpha] = xyz;
  const [X, Y, Z] = [x / 100, y / 100, z / 100];

  const rLinear = X * matrix[0] + Y * matrix[1] + Z * matrix[2];
  const gLinear = X * matrix[3] + Y * matrix[4] + Z * matrix[5];
  const bLinear = X * matrix[6] + Y * matrix[7] + Z * matrix[8];

  return assign(
    out,
    clamp(Math.round(255 * gamma(rLinear)), 0, 255),
    clamp(Math.round(255 * gamma(gLinear)), 0, 255),
    clamp(Math.round(255 * gamma(bLinear)), 0, 255),
    alpha,
  );
}

// biome-ignore format: matrix
const BRADFORD_Ma = Float64Array.of(
   1.0478112,  0.0228866, -0.0501270,
   0.0295424,  0.9904844, -0.0170491,
  -0.0092345,  0.0150436,  0.7521316,
)

const ϵ = 216 / 24389;
const κ = 24389 / 27;

export function toLab(xyz: XYZTuple, out: LabTuple = createLab()): LabTuple {
  const [, x, y, z, alpha] = xyz;

  const xD50 = x * BRADFORD_Ma[0] + y * BRADFORD_Ma[1] + z * BRADFORD_Ma[2];
  const yD50 = x * BRADFORD_Ma[3] + y * BRADFORD_Ma[4] + z * BRADFORD_Ma[5];
  const zD50 = x * BRADFORD_Ma[6] + y * BRADFORD_Ma[7] + z * BRADFORD_Ma[8];

  const [refX, refY, refZ] = D50;
  const xr = xD50 / refX;
  const yr = yD50 / refY;
  const zr = zD50 / refZ;

  const fx = xr > ϵ ? Math.cbrt(xr) : (κ * xr + 16) / 116;
  const fy = yr > ϵ ? Math.cbrt(yr) : (κ * yr + 16) / 116;
  const fz = zr > ϵ ? Math.cbrt(zr) : (κ * zr + 16) / 116;

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return assign(out, L, a, b, alpha);
}

// biome-ignore format: matrix
const OKLAB_M1 = Float64Array.of(
  0.8190224432164319,   0.3619062562801221, -0.12887378261216414,
  0.0329836671980271,   0.9292868468965546,  0.03614466816999844,
  0.048177199566046255, 0.26423952494422764, 0.6335478258136937,
);

// biome-ignore format: matrix
const OKLAB_M2 = Float64Array.of(
   0.2104542553,  0.7936177850, -0.0040720468,
   1.9779984951, -2.4285922050,  0.4505937099,
   0.0259040371,  0.7827717662, -0.8086757660,
)

// see https://bottosson.github.io/posts/oklab/
export function toOkLab(
  xyz: XYZTuple,
  out: okLabTuple = createOkLab(),
): okLabTuple {
  const [x, y, z, alpha] = [xyz[1] / 100, xyz[2] / 100, xyz[3] / 100, xyz[4]];

  const l = x * OKLAB_M1[0] + y * OKLAB_M1[1] + z * OKLAB_M1[2];
  const m = x * OKLAB_M1[3] + y * OKLAB_M1[4] + z * OKLAB_M1[5];
  const s = x * OKLAB_M1[6] + y * OKLAB_M1[7] + z * OKLAB_M1[8];

  const l$ = Math.cbrt(l);
  const m$ = Math.cbrt(m);
  const s$ = Math.cbrt(s);

  const L = l$ * OKLAB_M2[0] + m$ * OKLAB_M2[1] + s$ * OKLAB_M2[2];
  const a = l$ * OKLAB_M2[3] + m$ * OKLAB_M2[4] + s$ * OKLAB_M2[5];
  const b = l$ * OKLAB_M2[6] + m$ * OKLAB_M2[7] + s$ * OKLAB_M2[8];

  return assign(out, L, a, b, alpha);
}

/**
 * Mix two colors in xyz color space.
 * @param c1
 * @param c2
 * @param bias
 * @param out
 */
export const mix = (
  c1: XYZTuple,
  c2: XYZTuple,
  bias: number,
  out: XYZTuple = createXYZ(),
): XYZTuple => {
  const [, c1x, c1y, c1z, c1alpha] = c1;
  const [, c2x, c2y, c2z, c2alpha] = c2;

  const alpha = !(c1alpha === undefined && c2alpha === undefined)
    ? lerp(c1alpha ?? 1.0, c2alpha ?? 1.0, bias)
    : undefined;

  return assign(
    out,
    lerp(c1x, c2x, bias),
    lerp(c1y, c2y, bias),
    lerp(c1z, c2z, bias),
    alpha,
  );
};
