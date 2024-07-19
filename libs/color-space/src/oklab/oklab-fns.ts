// prettier-ignore
import  { type okLabTuple, create as createOkLab } from "../tuples/oklab-tuple";
import { type XYZTuple, create as createXYZ } from '../tuples/xyz-tuple';
import { lerp } from '../utils/lerp';
import { assign } from '../utils/assign-values';

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
  out: XYZTuple = createXYZ(),
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

  return assign(out, x * 100, y * 100, z * 100, alpha);
}

export const lighten = (
  [, L, a, b, alpha]: okLabTuple,
  amount: number,
  out: okLabTuple = createOkLab(),
): okLabTuple =>
  assign(
    out,
    lerp(L, 1.0, amount),
    lerp(a, 0, amount),
    lerp(b, 0, amount),
    alpha,
  );

export const darken = (
  [, L, a, b, alpha]: okLabTuple,
  amount: number,
  out: okLabTuple = createOkLab(),
): okLabTuple =>
  assign(
    out,
    lerp(L, 0, amount),
    lerp(a, 0, amount),
    lerp(b, 0, amount),
    alpha,
  );

export const mix = (
  c1: okLabTuple,
  c2: okLabTuple,
  bias: number,
  out: okLabTuple = createOkLab(),
): okLabTuple => {
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
