import { describe, expect, it } from 'vitest';

import * as sRGB from './srgb/srgb-fns.js';
import * as XYZ from './xyz/xyz-fns.js';
import * as LAB from './lab/lab-fns.js';
import * as okLAB from './oklab/oklab-fns.js';

describe('round trip', () => {
  it('should convert from hex to lab to hex and get the same value', () => {
    const expected = '#39c74c';
    const srgb = sRGB.fromHex(expected);
    const xyz = sRGB.toXYZ(srgb);
    const lab = XYZ.toLab(xyz);
    const xyz2 = LAB.toXYZ(lab);
    const srgb2 = XYZ.toSRGB(xyz2);
    const hex = sRGB.toHex(srgb2);
    expect(hex).toBe(expected);
  });

  it('should convert from hex to oklab to hex and get the same value', () => {
    const expected = '#39c74c';
    const srgb = sRGB.fromHex(expected);
    const xyz = sRGB.toXYZ(srgb);
    const oklab = XYZ.toOkLab(xyz);
    const xyz2 = okLAB.toXYZ(oklab);
    const srgb2 = XYZ.toSRGB(xyz2);
    const hex = sRGB.toHex(srgb2);
    expect(hex).toBe(expected);
  });
});
