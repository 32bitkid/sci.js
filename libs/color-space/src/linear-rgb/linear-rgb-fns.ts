import { type sRGBTuple, create as createSRGB } from '../tuples/srgb-tuple';
import { clamp } from '../utils/clamp';
import {
  type linearRGBTuple,
  create as createLinearRGB,
} from '../tuples/linear-rgb-tuple';
import { assign } from '../utils/assign-values';
import { lerp } from '../utils/lerp';

const gamma = (c: number) =>
  c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;

export function toSRGB(
  [, Lr, Lg, Lb, alpha]: linearRGBTuple,
  out: sRGBTuple = createSRGB(),
): sRGBTuple {
  const r = clamp(Math.round(255 * gamma(Lr)), 0, 255);
  const g = clamp(Math.round(255 * gamma(Lg)), 0, 255);
  const b = clamp(Math.round(255 * gamma(Lb)), 0, 255);
  return assign(out, r, g, b, alpha);
}

/**
 * Mix two colors in linear sRGB color space.
 * @param c1
 * @param c2
 * @param bias
 * @param out
 */
export const mix = (
  c1: linearRGBTuple,
  c2: linearRGBTuple,
  bias: number,
  out: linearRGBTuple = createLinearRGB(),
): linearRGBTuple => {
  const [, c1r, c1g, c1b, c1alpha] = c1;
  const [, c2r, c2g, c2b, c2alpha] = c2;

  const r = lerp(c1r, c2r, bias);
  const g = lerp(c1g, c2g, bias);
  const b = lerp(c1b, c2b, bias);
  const alpha = !(c1alpha === undefined && c2alpha === undefined)
    ? lerp(c1alpha ?? 1.0, c2alpha ?? 1.0, bias)
    : undefined;

  return assign(out, r, g, b, alpha);
};
