import { type LabTuple, toString as stringify } from '../tuples/lab-tuple';
import * as LAB from './lab-fns';
import type { XYZTuple } from '../tuples/xyz-tuple';

describe('L*a*b* color space', () => {
  describe('toString()', () => {
    it.each<[LabTuple, string]>([
      [['CIELAB', 50, 0, 0], 'lab(50 0 0)'],
      [['CIELAB', 50, 0, 0, 1.0], 'lab(50 0 0 / 1)'],
      [['CIELAB', 50, 0.1234567, 0], 'lab(50 0.123 0)'],
    ])('should serialize', (color, expected) => {
      expect(stringify(color)).toBe(expected);
    });
  });

  describe('toXYZ()', () => {
    it.each<[LabTuple, XYZTuple]>([
      [
        ['CIELAB', 0, 0, 0],
        ['CIE-XYZ', 0, 0, 0],
      ],
      [
        ['CIELAB', 100, 0, 0],
        ['CIE-XYZ', 95.043, 99.9998, 108.88],
      ],
      [
        ['CIELAB', 62.989, 59.3832, 47.8834],
        ['CIE-XYZ', 46.841, 30.641, 9.40643],
      ],
      [
        ['CIELAB', 61.2267, 3.05668, -50.1836],
        ['CIE-XYZ', 31.279, 30.3092, 84.2935],
      ],
      [
        ['CIELAB', 42.3544, -16.3833, 30.3151],
        ['CIE-XYZ', 9.51604, 12.6486, 4.6281],
      ],
    ])('should convert %s', (color, expected) => {
      const actual = LAB.toXYZ(color);
      expect(actual[1]).toBeCloseTo(expected[1], 1);
      expect(actual[2]).toBeCloseTo(expected[2], 1);
      expect(actual[3]).toBeCloseTo(expected[3], 1);
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
