import { type LabTuple, toString } from './lab-tuple';
import * as LAB from './lab-fns';

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
