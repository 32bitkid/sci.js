import { type okLabTuple, toString } from './oklab-tuple';
import { type XYZTuple } from './xyz-tuple';
import { toXYZ } from './oklab-fns';

describe('okLab color-space', () => {
  describe('toString()', () => {
    it.each<[okLabTuple, string]>([
      [['okLab', 0.5, 0, 0], 'oklab(0.5 0 0)'],
      [['okLab', 0.5, 0, 0, 1.0], 'oklab(0.5 0 0 / 1)'],
      [['okLab', 0.5, 0.1234567, 0], 'oklab(0.5 0.123 0)'],
    ])('should serialize', (color, expected) => {
      expect(toString(color)).toBe(expected);
    });
  });

  describe('toXYZ()', () => {
    it.each<[okLabTuple, XYZTuple]>([
      [
        ['okLab', 1.0, 0.0, 0.0],
        ['CIE-XYZ', 95.0, 100.0, 108.9],
      ],
      [
        ['okLab', 0.45, 1.236, -0.019],
        ['CIE-XYZ', 100.0, 0.0, 0.0],
      ],
      [
        ['okLab', 0.922, -0.671, 0.263],
        ['CIE-XYZ', 0.0, 100.0, 0.0],
      ],
      [
        ['okLab', 0.153, -1.415, -0.449],
        ['CIE-XYZ', 0.0, 0.0, 100.0],
      ],
    ])('should convert %s', (okLab, expected) => {
      const actual = toXYZ(okLab);
      expect(actual[0]).toBe('CIE-XYZ');
      expect(actual[1]).toBeCloseTo(expected[1], 0);
      expect(actual[2]).toBeCloseTo(expected[2], 0);
      expect(actual[3]).toBeCloseTo(expected[3], 0);
    });
  });
});
