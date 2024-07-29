import { type sRGBTuple, create as createSRGB } from '../tuples/srgb-tuple';
import { type XYZTuple, create as createXYZ } from '../tuples/xyz-tuple';
import {
  type linearRGBTuple,
  create as createLinearRGB,
} from '../tuples/linear-rgb-tuple';
import { lerp } from '../utils/lerp';
import { assign } from '../utils/assign-values';
import { ToUint32Options, FromUint32Options } from './uint32-options';

export { redMeanDiff } from './srgb-red-mean-diff';

const inverseGamma = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

/**
 * Convert a color in {@link sRGBTuple} color space into a color in {@link linearRGBTuple} colorspace.
 *
 * @param rgb
 * @param out
 */
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
  // Lindbloom
  // 0.4124564, 0.3575761, 0.1804375,
  // 0.2126729, 0.7151522, 0.0721750,
  // 0.0193339, 0.1191920, 0.9503041,

  // IEC 61966-2-1:1999
  // 0.41239080,  0.35758434,   0.18048079,
  // 0.21263901,  0.71516868,   0.07219232,
  // 0.01933082,  0.11919478,   0.95053215,

  0.41239079926595934, 0.357584339383878,   0.1804807884018343,
  0.21263900587151027, 0.715168678767756,   0.07219231536073371,
  0.01933081871559182, 0.11919477979462598, 0.9505321522496607,
);

/**
 * Convert a color in {@link sRGBTuple} color space into a color in {@link XYZTuple} colorspace.
 *
 * @param rgb
 * @param out
 */
export function toXYZ(rgb: sRGBTuple, out: XYZTuple = createXYZ()): XYZTuple {
  const [, R, G, B, alpha] = rgb;
  const rL = inverseGamma(R / 255);
  const gL = inverseGamma(G / 255);
  const bL = inverseGamma(B / 255);

  const x = rL * matrix[0] + gL * matrix[1] + bL * matrix[2];
  const y = rL * matrix[3] + gL * matrix[4] + bL * matrix[5];
  const z = rL * matrix[6] + gL * matrix[7] + bL * matrix[8];

  return assign(out, x * 100, y * 100, z * 100, alpha);
}

/**
 * Encode as a 32-bit unsigned integer, defaults to [little-endian](https://developer.mozilla.org/en-US/docs/Glossary/Endianness) byte-ordering.
 * @param rgb
 * @param options
 */
export function toUint32(
  rgb: sRGBTuple,
  options: ToUint32Options = {},
): number {
  const [, r, g, b, a = 1.0] = rgb;
  const { byteOrder = 'little-endian' } = options;
  const le = byteOrder !== 'big-endian';
  return (
    (((a * 255) << (le ? 24 : 0)) |
      (b << (le ? 16 : 8)) |
      (g << (le ? 8 : 16)) |
      (r << (le ? 0 : 24))) >>>
    0
  );
}

/**
 * Encode as a CSS hex color string.
 *
 * @param rgb
 */
export function toHex(rgb: sRGBTuple): string {
  const [, r, g, b] = rgb;
  const hexCode = [r, g, b]
    .map((it) => (it >>> 0).toString(16).padStart(2, '0'))
    .join('');
  return `#${hexCode}`;
}

/**
 * Parse a {@link sRGBTuple} from a CSS hex color string . Supports both `#rgb` and `#rrggbb` formatted strings.
 *
 * @param hex
 */
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

/**
 * Parse a {@link sRGBTuple} from a 32-bit unsigned integer, defaults to [little-endian](https://developer.mozilla.org/en-US/docs/Glossary/Endianness) byte-ordering.
 *
 * @param c
 * @param options
 */
export function fromUint32(
  c: number,
  options: FromUint32Options = {},
): sRGBTuple {
  const { alpha = true, byteOrder = 'little-endian' } = options;
  const le = byteOrder !== 'big-endian';

  const r = (c >>> (le ? 0 : 24)) & 0xff;
  const g = (c >>> (le ? 8 : 16)) & 0xff;
  const b = (c >>> (le ? 16 : 8)) & 0xff;
  if (!alpha) return ['sRGB', r, g, b];

  const a = ((c >>> (le ? 24 : 0)) & 0xff) / 255;
  return ['sRGB', r, g, b, a];
}

/**
 * Mix two {@link sRGBTuple} colors in [sRGB](https://en.wikipedia.org/wiki/SRGB) color space.
 *
 * @param c1
 * @param c2
 * @param bias
 * @param out
 */
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
