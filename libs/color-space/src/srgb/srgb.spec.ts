import { toXYZ, toLinearRGB, fromHex, fromUint32, toUint32 } from './srgb-fns';
import {
  type sRGBTuple,
  isSRGBTuple,
  create,
  toString,
} from '../tuples/srgb-tuple';
import type { XYZTuple } from '../tuples/xyz-tuple';
import type { linearRGBTuple } from '../tuples/linear-rgb-tuple';

describe('sRGB color-space', () => {
  describe('toString()', () => {
    it('should handle a basic color', () => {
      const color = create(0x95, 0x6a, 0x62);
      expect(toString(color)).toBe('rgb(149 106 98)');
    });

    it('should handle alpha', () => {
      const color = create(0x95, 0x6a, 0x62, 0.5);
      expect(toString(color)).toBe('rgb(149 106 98 / 0.5)');
    });
  });

  describe('toXYZ()', () => {
    it.each<[sRGBTuple, XYZTuple]>([
      [
        ['sRGB', 0x95, 0x6a, 0x62],
        ['CIE-XYZ', 19.754, 17.581, 13.906],
      ],
      [
        ['sRGB', 0xdc, 0x4e, 0x4e],
        ['CIE-XYZ', 33.618, 21.219, 9.532],
      ],
      [
        ['sRGB', 0xff, 0x63, 0x47],
        ['CIE-XYZ', 46.841, 30.641, 9.40643],
      ],
    ])('should convert %s', (rgb, expected) => {
      const actual = toXYZ(rgb);
      expect(actual[0]).toBe(expected[0]);
      expect(actual[1]).toBeCloseTo(expected[1], 2);
      expect(actual[2]).toBeCloseTo(expected[2], 2);
      expect(actual[3]).toBeCloseTo(expected[3], 2);
    });
  });

  describe('toLinearRGB()', () => {
    it.each<[sRGBTuple, linearRGBTuple]>([
      [
        ['sRGB', 122, 65, 180],
        ['linear-RGB', 0.19462, 0.05286, 0.45641],
      ],
      [
        ['sRGB', 37, 75, 80, 0.5],
        ['linear-RGB', 0.0185, 0.07036, 0.08022, 0.5],
      ],
    ])('should convert %s to sRGB', (color, expected) => {
      const [space, r, g, b, a] = toLinearRGB(color);
      expect(space).toBe(expected[0]);
      expect(r).toBeCloseTo(expected[1]);
      expect(g).toBeCloseTo(expected[2]);
      expect(b).toBeCloseTo(expected[3]);
      expect(a).toBe(expected[4]);
    });
  });

  describe('hex parser', () => {
    it('should parse 6 digit hex values', () => {
      const actual = fromHex('#123456');
      expect(actual).toStrictEqual(['sRGB', 0x12, 0x34, 0x56]);
    });

    it('should parse 3 digit hex values', () => {
      const actual = fromHex('#abc');
      expect(actual).toStrictEqual(['sRGB', 0xaa, 0xbb, 0xcc]);
    });

    it('should ignore leading # symbol', () => {
      const actual = fromHex('badbee');
      expect(actual).toStrictEqual(['sRGB', 0xba, 0xdb, 0xee]);
    });

    it("should throw if gets something it doesn't expect", () => {
      expect(() => fromHex('rgba(255,255,255,1)')).toThrow();
    });
  });

  describe('uint32 conversion', () => {
    describe('fromUint32', () => {
      it('should load the correct bits', () => {
        const actual = fromUint32(0xffffaa55);
        expect(actual).toStrictEqual(['sRGB', 0x55, 0xaa, 0xff, 1.0]);
      });

      it('should load the handle alpha', () => {
        const actual = fromUint32(0x7fffaa55);
        expect(actual[4]).toBeCloseTo(0.49803);
      });

      it('should ignore the alpha component', () => {
        const actual = fromUint32(0x7f563412, { alpha: false });
        expect(actual).toStrictEqual(['sRGB', 0x12, 0x34, 0x56]);
      });

      it('should support big-endian encoded ints', () => {
        const actual = fromUint32(0x123456ff, { byteOrder: 'big-endian' });
        expect(actual).toStrictEqual(['sRGB', 0x12, 0x34, 0x56, 1.0]);
      });

      it('should support big-endian encoded ints without alpha', () => {
        const actual = fromUint32(0x123456ff, {
          byteOrder: 'big-endian',
          alpha: false,
        });
        expect(actual).toStrictEqual(['sRGB', 0x12, 0x34, 0x56]);
      });
    });

    describe('toUint32', () => {
      it('should convert correctly back into a uint32', () => {
        const actual = toUint32(['sRGB', 0x55, 0xaa, 0x99, 1.0]);
        expect(actual).toBe(0xff99aa55);
      });

      it('should convert to big-endian format', () => {
        const actual = toUint32(['sRGB', 0x55, 0xaa, 0x99, 1.0], {
          byteOrder: 'big-endian',
        });
        expect(actual).toBe(0x55aa99ff);
      });
    });
  });

  describe('type predicate isSRGBTuple()', () => {
    it('should allow a normal sRGB color', () => {
      expect(isSRGBTuple(['sRGB', 12, 34, 56])).toBe(true);
    });

    it('should allow a fractional sRGB color', () => {
      expect(isSRGBTuple(['sRGB', 12.5, 34.2, 56.9])).toBe(true);
    });

    it('should min/max range', () => {
      expect(isSRGBTuple(['sRGB', 0, 0, 0])).toBe(true);
      expect(isSRGBTuple(['sRGB', 255, 255, 255])).toBe(true);
    });

    it('should handle alpha', () => {
      expect(isSRGBTuple(['sRGB', 0, 0, 0, 1.0])).toBe(true);
    });

    it.each<[string, unknown]>([
      ['r < 0', ['sRGB', -1, 0, 0]],
      ['g < 0', ['sRGB', 0, -1, 0]],
      ['g < 0', ['sRGB', 0, 0, -1]],
      ['r > 255', ['sRGB', 256, 0, 0]],
      ['g > 255', ['sRGB', 0, 256, 0]],
      ['g > 255', ['sRGB', 0, 0, 256]],
      ['alpha < 0.0', ['sRGB', 0, 0, 0, -0.1]],
      ['alpha > 1.0', ['sRGB', 0, 0, 0, 1.1]],
      ['alpha not a number', ['sRGB', 0, 0, 0, 'fuzzy']],
      ['not an sRGB', ['HSL', 128, 20, 10]],
      ['just a number', Math.PI],
      ['a string', 'rgb(128 128 128)'],
    ])('should reject %s', (_, bad) => {
      expect(isSRGBTuple(bad)).toBe(false);
    });
  });
});
