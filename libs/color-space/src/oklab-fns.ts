// prettier-ignore
import  { type okLabTuple } from "./oklab-tuple";
import { type XYZTuple } from './xyz-tuple';
import { lerp } from './utils/lerp';
import { alphaPart } from './utils/alpha-part';
import { formatFloat } from './utils/format-float';

export const create = (
  L: number,
  a: number,
  b: number,
  alpha?: number,
): okLabTuple => ['okLab', L, a, b, alpha];

export const toString = ([, L, a, b, alpha]: okLabTuple) =>
  `oklab(${formatFloat(L)} ${formatFloat(a)} ${formatFloat(b)}${alphaPart(alpha)})`;

// prettier-ignore
const OKLAB_M1i = Float64Array.of(
   1.2268798733741557,  -0.5578149965554813,   0.28139105017721583,
  -0.04057576262431372,  1.1122868293970594,  -0.07171106666151701,
  -0.07637294974672142, -0.4214933239627914,   1.5869240244272418
);

// prettier-ignore
const OKLAB_M2i = Float64Array.of(
  0.9999999984505198,  0.396337792173767856,  0.21580375806075880,
  1.0000000088817607, -0.10556134232365634,  -0.0638541747717059,
  1.000000054672410,  -0.08948418209496575,  -1.2914855378640917
);

// see https://bottosson.github.io/posts/oklab/
export function toXYZ(
  oklab: okLabTuple,
  out: XYZTuple = ['CIE-XYZ', 0, 0, 0],
): XYZTuple {
  const [, L, a, b, alpha] = oklab;

  const l$ = L * OKLAB_M2i[0] + a * OKLAB_M2i[1] + b * OKLAB_M2i[2];
  const m$ = L * OKLAB_M2i[3] + a * OKLAB_M2i[4] + b * OKLAB_M2i[5];
  const s$ = L * OKLAB_M2i[6] + a * OKLAB_M2i[7] + b * OKLAB_M2i[8];

  const l = Math.pow(l$, 3);
  const m = Math.pow(m$, 3);
  const s = Math.pow(s$, 3);

  const x = l * OKLAB_M1i[0] + m * OKLAB_M1i[1] + s * OKLAB_M1i[2];
  const y = l * OKLAB_M1i[3] + m * OKLAB_M1i[4] + s * OKLAB_M1i[5];
  const z = l * OKLAB_M1i[6] + m * OKLAB_M1i[7] + s * OKLAB_M1i[8];

  out[1] = x * 100;
  out[2] = y * 100;
  out[3] = z * 100;
  out[4] = alpha;

  return out;
}

export const lighten = (
  [, L, a, b, alpha]: okLabTuple,
  amount: number,
): okLabTuple => [
  'okLab',
  lerp(L, 1.0, amount),
  lerp(a, 0, amount),
  lerp(b, 0, amount),
  alpha,
];

export const darken = (
  [, L, a, b, alpha]: okLabTuple,
  amount: number,
): okLabTuple => [
  'okLab',
  lerp(L, 0, amount),
  lerp(a, 0, amount),
  lerp(b, 0, amount),
  alpha,
];

export const mix = (
  c1: okLabTuple,
  c2: okLabTuple,
  bias: number,
): okLabTuple => {
  const [, c1L, c1a, c1b, c1alpha] = c1;
  const [, c2L, c2a, c2b, c2alpha] = c2;

  const alpha = !(c1alpha === undefined && c2alpha === undefined)
    ? ([lerp(c1alpha ?? 1.0, c2alpha ?? 1.0, bias)] as const)
    : ([] as const);

  return [
    'okLab',
    lerp(c1L, c2L, bias),
    lerp(c1a, c2a, bias),
    lerp(c1b, c2b, bias),
    ...alpha,
  ];
};
