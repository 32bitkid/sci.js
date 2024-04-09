import { sRGBTuple } from './srgb-tuple';
import { linearRGBTuple } from './linear-rgb-tuple';
import { toSRGB } from './linear-rgb-fns';

describe('linear RGB color-space', () => {
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
