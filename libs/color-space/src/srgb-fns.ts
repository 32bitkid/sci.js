import { type sRGBTuple, create as createSRGB } from './srgb-tuple';
import { type XYZTuple, create as createXYZ } from './xyz-tuple';
import {
  type linearRGBTuple,
  create as createLinearRGB,
} from './linear-rgb-tuple';
import { lerp } from './utils/lerp';
import { assign } from './utils/assign-values';
export { redMeanDiff } from './srgb-red-mean-diff';

const inverseGamma = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

export function toLinearRGB(
  rgb: sRGBTuple,
  out: linearRGBTuple = createLinearRGB(),
) {
  const [, R, G, B, alpha] = rgb;
  const rL = inverseGamma(R / 255);
  const gL = inverseGamma(G / 255);
  const bL = inverseGamma(B / 255);
  return assign(out, rL, gL, bL, alpha);
}

// prettier-ignore
const matrix = Float64Array.of(
  0.4124564, 0.3575761, 0.1804375,
  0.2126729, 0.7151522, 0.0721750,
  0.0193339, 0.1191920, 0.9503041,
);

export function toXYZ(rgb: sRGBTuple, out: XYZTuple = createXYZ()): XYZTuple {
  const [, R, G, B, alpha] = rgb;
  const rL = inverseGamma(R / 255) * 100;
  const gL = inverseGamma(G / 255) * 100;
  const bL = inverseGamma(B / 255) * 100;

  out[1] = rL * matrix[0] + gL * matrix[1] + bL * matrix[2];
  out[2] = rL * matrix[3] + gL * matrix[4] + bL * matrix[5];
  out[3] = rL * matrix[6] + gL * matrix[7] + bL * matrix[8];
  out[4] = alpha;

  return out;
}

export function toUint32(rgb: sRGBTuple): number {
  const [, r, g, b, a = 1.0] = rgb;
  return (((a * 255) << 24) | (b << 16) | (g << 8) | r) >>> 0;
}

export function toHex(rgb: sRGBTuple): string {
  const [, r, g, b] = rgb;
  const hexCode = [r, g, b]
    .map((it) => (it >>> 0).toString(16).padStart(2, '0'))
    .join('');
  return `#${hexCode}`;
}

export function fromHex(hex: string): sRGBTuple {
  if (/^#?[0-9a-f]{3}$/i.test(hex))
    return [
      'sRGB',
      parseInt(hex.slice(-3, -2), 16) * 0x11,
      parseInt(hex.slice(-2, -1), 16) * 0x11,
      parseInt(hex.slice(-1), 16) * 0x11,
    ];

  if (/^#?[0-9a-f]{6}$/i.test(hex))
    return [
      'sRGB',
      parseInt(hex.slice(-6, -4), 16),
      parseInt(hex.slice(-4, -2), 16),
      parseInt(hex.slice(-2), 16),
    ];

  throw new Error('invalid format');
}

export function fromUint24(c: number): sRGBTuple {
  return ['sRGB', (c >>> 0) & 0xff, (c >>> 8) & 0xff, (c >>> 16) & 0xff];
}

export function fromUint32(c: number): sRGBTuple {
  return [
    'sRGB',
    (c >>> 0) & 0xff,
    (c >>> 8) & 0xff,
    (c >>> 16) & 0xff,
    ((c >>> 24) & 0xff) / 255,
  ];
}

export const mix = (
  c1: sRGBTuple,
  c2: sRGBTuple,
  bias: number,
  out: sRGBTuple = createSRGB(),
): sRGBTuple => {
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
