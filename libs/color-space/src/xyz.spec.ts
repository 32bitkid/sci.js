import { toOkLab } from './xyz-fns';
import { type XYZTuple } from './xyz-tuple';
import { type okLabTuple } from './oklab-tuple';

describe('CIE-XYZ color-space', () => {
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
