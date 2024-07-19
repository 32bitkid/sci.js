import { toLab, toOkLab, toSRGB } from './xyz-fns';
import { type XYZTuple } from '../tuples/xyz-tuple';
import { type LabTuple } from '../tuples/lab-tuple';
import { type okLabTuple } from '../tuples/oklab-tuple';
import { type sRGBTuple } from '../tuples/srgb-tuple';

describe('CIE-XYZ color-space', () => {
  describe('toSRGB()', () => {
    it.each<[XYZTuple, sRGBTuple]>([
      [
        ['CIE-XYZ', 19.7536522709638, 17.580667923785445, 13.90586203841256],
        ['sRGB', 149, 106, 98],
      ],
    ])('ok', (xyz, expected) => {
      const actual = toSRGB(xyz);
      expect(actual).toStrictEqual(expected);
    });
  });
  describe('toLab()', () => {
    it.each<[XYZTuple, LabTuple]>([
      [
        ['CIE-XYZ', 0, 0, 0],
        ['CIELAB', 0, 0, 0],
      ],
      [
        ['CIE-XYZ', 95.043, 99.9998, 108.88],
        ['CIELAB', 100, 0, 0],
      ],
      [
        ['CIE-XYZ', 46.841, 30.641, 9.40643],
        ['CIELAB', 62.989, 59.3832, 47.8834],
      ],
      [
        ['CIE-XYZ', 31.279, 30.3092, 84.2935],
        ['CIELAB', 61.2267, 3.05668, -50.1836],
      ],
      [
        ['CIE-XYZ', 9.51604, 12.6486, 4.6281],
        ['CIELAB', 42.3544, -16.3833, 30.3151],
      ],
    ])('should convert %s', (xyz, expected) => {
      const actual = toLab(xyz);
      expect(actual[0]).toBe('CIELAB');
      expect(actual[1]).toBeCloseTo(expected[1], 1);
      expect(actual[2]).toBeCloseTo(expected[2], 1);
      expect(actual[3]).toBeCloseTo(expected[3], 1);
    });
  });

  describe('toOkLab()', () => {
    it.each<[XYZTuple, okLabTuple]>([
      [
        ['CIE-XYZ', 95.046, 100.0, 108.91],
        ['okLab', 1.0, 0.0, 0.0],
      ],
      [
        ['CIE-XYZ', 95.046, 0.0, 0.0],
        ['okLab', 0.442381, 1.21501, -0.0186631],
      ],
      [
        ['CIE-XYZ', 46.841, 30.641, 9.40643],
        ['okLab', 0.696216, 0.165265, 0.104555],
      ],
      [
        ['CIE-XYZ', 31.279, 30.3092, 84.2935],
        ['okLab', 0.674562, -0.0212625, -0.13971],
      ],
      [
        ['CIE-XYZ', 9.51604, 12.6486, 4.6281],
        ['okLab', 0.495483, -0.0528575, 0.0723169],
      ],
    ])('should convert %s', (xyz, expected) => {
      const actual = toOkLab(xyz);
      expect(actual[0]).toBe('okLab');
      expect(actual[1]).toBeCloseTo(expected[1], 3);
      expect(actual[2]).toBeCloseTo(expected[2], 3);
      expect(actual[3]).toBeCloseTo(expected[3], 3);
    });
  });
});
