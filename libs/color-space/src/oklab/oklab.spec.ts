import { type okLabTuple, toString } from '../tuples/oklab-tuple';
import type { XYZTuple } from '../tuples/xyz-tuple';
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
        ['CIE-XYZ', 95.046, 100.0, 108.91],
      ],
      [
        ['okLab', 0.442381, 1.21501, -0.0186631],
        ['CIE-XYZ', 95.046, 0.0, 0.0],
      ],
      [
        ['okLab', 0.696216, 0.165265, 0.104555],
        ['CIE-XYZ', 46.841, 30.641, 9.40643],
      ],
      [
        ['okLab', 0.674562, -0.0212625, -0.13971],
        ['CIE-XYZ', 31.279, 30.3092, 84.2935],
      ],
      [
        ['okLab', 0.495483, -0.0528575, 0.0723169],
        ['CIE-XYZ', 9.51604, 12.6486, 4.6281],
      ],
    ])('should convert %s', (okLab, expected) => {
      const actual = toXYZ(okLab);
      expect(actual[0]).toBe('CIE-XYZ');
      expect(actual[1]).toBeCloseTo(expected[1], 2);
      expect(actual[2]).toBeCloseTo(expected[2], 2);
      expect(actual[3]).toBeCloseTo(expected[3], 2);
    });
  });
});
