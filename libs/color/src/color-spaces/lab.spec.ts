import { LabColor } from './types';
import * as LAB from './lab';

describe('L*a*b* colorspace', () => {
  describe('lighten()', () => {
    it('should make a color lighter', () => {
      const gray: LabColor = ['CIE-L*a*b*', 50, 0, 0, 1.0];
      const result = LAB.lighten(gray, 0.1);
      expect(result).toStrictEqual(['CIE-L*a*b*', 55, 0, 0, 1.0]);
    });

    it('should make desaturate the color components', () => {
      const red: LabColor = ['CIE-L*a*b*', 50, 58, 17, 1.0];
      const result = LAB.lighten(red, 0.5);
      expect(result[1]).toBeGreaterThan(red[1]);
      expect(result[2]).toBeLessThan(red[2]);
      expect(result[3]).toBeLessThan(red[3]);
    });
  });

  describe('darken()', () => {
    it('should make a color lighter', () => {
      const gray: LabColor = ['CIE-L*a*b*', 50, 0, 0, 1.0];
      const result = LAB.darken(gray, 0.1);
      expect(result).toStrictEqual(['CIE-L*a*b*', 45, 0, 0, 1.0]);
    });

    it('should make desaturate the color components', () => {
      const red: LabColor = ['CIE-L*a*b*', 50, 58, 17, 1.0];
      const result = LAB.darken(red, 0.5);
      expect(result[1]).toBeLessThan(red[1]);
      expect(result[2]).toBeLessThan(red[2]);
      expect(result[3]).toBeLessThan(red[3]);
    });
  });

  describe('mixing in L*a*b*', () => {
    it('should maintain alpha', () => {
      const white: LabColor = ['CIE-L*a*b*', 100, 0, 0, 1.0];
      const black: LabColor = ['CIE-L*a*b*', 0, 0, 0, 1.0];
      const result = LAB.mix(white, black, 0.5);
      expect(result).toStrictEqual(['CIE-L*a*b*', 50, 0, 0, 1.0]);
    });

    it('should mix alpha', () => {
      const white: LabColor = ['CIE-L*a*b*', 100, 0, 0, 1.0];
      const black: LabColor = ['CIE-L*a*b*', 0, 0, 0, 0.0];
      const result = LAB.mix(white, black, 0.5);
      expect(result).toStrictEqual(['CIE-L*a*b*', 50, 0, 0, 0.5]);
    });

    it('should assume alpha if missing/unspecified', () => {
      const white: LabColor = ['CIE-L*a*b*', 100, 0, 0, 1.0];
      const black: LabColor = ['CIE-L*a*b*', 0, 0, 0];
      const result = LAB.mix(white, black, 0.5);
      expect(result).toStrictEqual(['CIE-L*a*b*', 50, 0, 0, 1.0]);
    });

    it('should propagate missing alpha is both dont have it', () => {
      const white: LabColor = ['CIE-L*a*b*', 100, 0, 0];
      const black: LabColor = ['CIE-L*a*b*', 0, 0, 0];
      const result = LAB.mix(white, black, 0.5);
      expect(result).toStrictEqual(['CIE-L*a*b*', 50, 0, 0]);
    });
  });
});
