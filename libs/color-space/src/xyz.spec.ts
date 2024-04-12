import { toLab, toOkLab, toSRGB } from './xyz-fns';
import { type XYZTuple } from './xyz-tuple';
import { type LabTuple } from './lab-tuple';
import { type okLabTuple } from './oklab-tuple';
import { type sRGBTuple } from './srgb-tuple';

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
        ['CIE-XYZ', 33.6138111725463, 21.216975215758012, 9.533249571284117],
        ['CIELAB', 53.188, 55.375, 30.482],
      ],
      [
        ['CIE-XYZ', 19.7536522709638, 17.580667923785445, 13.90586203841256],
        ['CIELAB', 48.983, 16.068, 11.326],
      ],
    ])('should convert %s', (xyz, expected) => {
      const actual = toLab(xyz);
      expect(actual[0]).toBe('CIELAB');
      expect(actual[1]).toBeCloseTo(expected[1], 2);
      expect(actual[2]).toBeCloseTo(expected[2], 2);
      expect(actual[3]).toBeCloseTo(expected[3], 2);
    });
  });

  describe('toOkLab()', () => {
    it.each<[XYZTuple, okLabTuple]>([
      [
        ['CIE-XYZ', 95.0, 100.0, 108.9],
        ['okLab', 1.0, 0.0, 0.0],
      ],
      [
        ['CIE-XYZ', 100.0, 0.0, 0.0],
        ['okLab', 0.45, 1.236, -0.019],
      ],
      [
        ['CIE-XYZ', 0.0, 100.0, 0.0],
        ['okLab', 0.922, -0.671, 0.263],
      ],
      [
        ['CIE-XYZ', 0.0, 0.0, 100.0],
        ['okLab', 0.153, -1.415, -0.449],
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
