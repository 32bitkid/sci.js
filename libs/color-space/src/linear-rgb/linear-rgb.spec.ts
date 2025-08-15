import type { sRGBTuple } from '../tuples/srgb-tuple';
import {
  type linearRGBTuple,
  create,
  toString as stringify,
} from '../tuples/linear-rgb-tuple';
import { toSRGB } from './linear-rgb-fns';

describe('linear RGB color-space', () => {
  describe('toString()', () => {
    it('should handle a basic color', () => {
      const color = create(0.301, 0.144, 0.122);
      expect(stringify(color)).toBe('color(srgb-linear 0.301 0.144 0.122)');
    });

    it('should handle alpha', () => {
      const color = create(0.301, 0.144, 0.122, 0.5);
      expect(stringify(color)).toBe(
        'color(srgb-linear 0.301 0.144 0.122 / 0.5)',
      );
    });
  });

  describe('toSRGB()', () => {
    it.each<[linearRGBTuple, sRGBTuple]>([
      [
        ['linear-RGB', 0.19462, 0.05286, 0.45641],
        ['sRGB', 122, 65, 180],
      ],
      [
        ['linear-RGB', 0.0185, 0.07036, 0.08022, 0.5],
        ['sRGB', 37, 75, 80, 0.5],
      ],
    ])('should convert %s to sRGB', (color, expected) => {
      expect(toSRGB(color)).toStrictEqual(expected);
    });
  });
});
