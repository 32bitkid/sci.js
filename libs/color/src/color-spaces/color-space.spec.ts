import * as sRGBfns from './srgb';
import * as XYZfns from './xyz';
import * as LABfns from './lab';
import * as okLABfns from './oklab';

describe('round trip', () => {
  it('should convert from hex to lab to hex and get the same value', () => {
    const expected = '#39c74c';
    const srgb = sRGBfns.fromHex(expected);
    const xyz = sRGBfns.toXYZ(srgb);
    const lab = XYZfns.toLab(xyz);
    const xyz2 = LABfns.toXYZ(lab);
    const srgb2 = XYZfns.toSRGB(xyz2);
    const hex = sRGBfns.toHex(srgb2);
    expect(hex).toBe(expected);
  });

  it('should convert from hex to oklab to hex and get the same value', () => {
    const expected = '#39c74c';
    const srgb = sRGBfns.fromHex(expected);
    const xyz = sRGBfns.toXYZ(srgb);
    const oklab = XYZfns.toOkLab(xyz);
    const xyz2 = okLABfns.toXYZ(oklab);
    const srgb2 = XYZfns.toSRGB(xyz2);
    const hex = sRGBfns.toHex(srgb2);
    expect(hex).toBe(expected);
  });
});
