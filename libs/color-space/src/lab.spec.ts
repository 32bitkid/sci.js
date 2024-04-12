import { type LabTuple, toString } from './lab-tuple';
import * as LAB from './lab-fns';
import { XYZTuple } from './xyz-tuple';

describe('L*a*b* colorspace', () => {
  describe('toString()', () => {
    it.each<[LabTuple, string]>([
      [['CIELAB', 50, 0, 0], 'lab(50 0 0)'],
      [['CIELAB', 50, 0, 0, 1.0], 'lab(50 0 0 / 1)'],
      [['CIELAB', 50, 0.1234567, 0], 'lab(50 0.123 0)'],
    ])('should serialize', (color, expected) => {
      expect(toString(color)).toBe(expected);
    });
  });

  describe('toXYZ()', () => {
    it.each<[LabTuple, XYZTuple]>([
      [
        ['CIELAB', 0, 0, 0],
        ['CIE-XYZ', 0, 0, 0],
      ],
      [
        ['CIELAB', 53.186147049899986, 55.37222125570895, 30.48480460763634],
        ['CIE-XYZ', 33.6138111725463, 21.216975215758012, 9.533249571284117],
      ],
      [
        ['CIELAB', 48.98350211637147, 16.068783498963956, 11.330338665713313],
        ['CIE-XYZ', 19.7536522709638, 17.580667923785445, 13.90586203841256],
      ],
      [
        ['CIELAB', 100, 0, 0],
        ['CIE-XYZ', 95.046, 100, 108.91],
      ],
    ])('should convert %s', (color, expected) => {
      const actual = LAB.toXYZ(color);
      expect(actual[1]).toBeCloseTo(expected[1], 4);
      expect(actual[2]).toBeCloseTo(expected[2], 4);
      expect(actual[3]).toBeCloseTo(expected[3], 4);
    });
  });

  describe('lighten()', () => {
    it('should make a color lighter', () => {
      const gray: LabTuple = ['CIELAB', 50, 0, 0, 1.0];
      const result = LAB.lighten(gray, 0.1);
      expect(result).toStrictEqual(['CIELAB', 55, 0, 0, 1.0]);
    });

    it('should make desaturate the color components', () => {
      const red: LabTuple = ['CIELAB', 50, 58, 17, 1.0];
      const result = LAB.lighten(red, 0.5);
      expect(result[1]).toBeGreaterThan(red[1]);
      expect(result[2]).toBeLessThan(red[2]);
      expect(result[3]).toBeLessThan(red[3]);
    });
  });

  describe('darken()', () => {
    it('should make a color lighter', () => {
      const gray: LabTuple = ['CIELAB', 50, 0, 0, 1.0];
      const result = LAB.darken(gray, 0.1);
      expect(result).toStrictEqual(['CIELAB', 45, 0, 0, 1.0]);
    });

    it('should make desaturate the color components', () => {
      const red: LabTuple = ['CIELAB', 50, 58, 17, 1.0];
      const result = LAB.darken(red, 0.5);
      expect(result[1]).toBeLessThan(red[1]);
      expect(result[2]).toBeLessThan(red[2]);
      expect(result[3]).toBeLessThan(red[3]);
    });
  });

  describe('mixing in L*a*b*', () => {
    it('should maintain alpha', () => {
      const white: LabTuple = ['CIELAB', 100, 0, 0, 1.0];
      const black: LabTuple = ['CIELAB', 0, 0, 0, 1.0];
      const result = LAB.mix(white, black, 0.5);
      expect(result).toStrictEqual(['CIELAB', 50, 0, 0, 1.0]);
    });

    it('should mix alpha', () => {
      const white: LabTuple = ['CIELAB', 100, 0, 0, 1.0];
      const black: LabTuple = ['CIELAB', 0, 0, 0, 0.0];
      const result = LAB.mix(white, black, 0.5);
      expect(result).toStrictEqual(['CIELAB', 50, 0, 0, 0.5]);
    });

    it('should assume alpha if missing/unspecified', () => {
      const white: LabTuple = ['CIELAB', 100, 0, 0, 1.0];
      const black: LabTuple = ['CIELAB', 0, 0, 0];
      const result = LAB.mix(white, black, 0.5);
      expect(result).toStrictEqual(['CIELAB', 50, 0, 0, 1.0]);
    });

    it('should propagate missing alpha is both dont have it', () => {
      const white: LabTuple = ['CIELAB', 100, 0, 0];
      const black: LabTuple = ['CIELAB', 0, 0, 0];
      const result = LAB.mix(white, black, 0.5);
      expect(result).toStrictEqual(['CIELAB', 50, 0, 0]);
    });
  });
});
