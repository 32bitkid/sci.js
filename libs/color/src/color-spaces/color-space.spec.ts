import * as sRGBfns from './srgb';
import * as XYZfns from './xyz';
import * as LABfns from './lab';

describe('round trip', () => {
  it('should get back to the same value', () => {
    const expected = '#39c74c';
    const srgb = sRGBfns.fromHex(expected);
    const xyz = sRGBfns.toXYZ(srgb);
    const lab = XYZfns.toLab(xyz);
    const xyz2 = LABfns.toXYZ(lab);
    const srgb2 = XYZfns.toSRGB(xyz2);
    const hex = sRGBfns.toHex(srgb2);
    expect(hex).toBe(expected);
  });
});
