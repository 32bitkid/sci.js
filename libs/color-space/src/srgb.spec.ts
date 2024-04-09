import * as sRGB from './srgb-fns';
import { type sRGBTuple } from './srgb-tuple';
import { type XYZTuple } from './xyz-tuple';

describe('sRGB color-space', () => {
  describe('toXYZ', () => {
    it.each<[sRGBTuple, XYZTuple]>([
      [
        ['sRGB', 0x95, 0x6a, 0x62],
        ['CIE-XYZ', 19.7536, 17.58, 13.91],
      ],
    ])('should do something', (rgb, expected) => {
      const actual = sRGB.toXYZ(rgb);
      expect(actual[0]).toBe(expected[0]);
      expect(actual[1]).toBeCloseTo(expected[1]);
      expect(actual[2]).toBeCloseTo(expected[2]);
      expect(actual[3]).toBeCloseTo(expected[3]);
    });
  });

  describe('hex parser', () => {
    it('should parse 6 digit hex values', () => {
      const actual = sRGB.fromHex('#123456');
      expect(actual).toStrictEqual(['sRGB', 0x12, 0x34, 0x56]);
    });

    it('should parse 3 digit hex values', () => {
      const actual = sRGB.fromHex('#abc');
      expect(actual).toStrictEqual(['sRGB', 0xaa, 0xbb, 0xcc]);
    });

    it('should ignore leading # symbol', () => {
      const actual = sRGB.fromHex('badbee');
      expect(actual).toStrictEqual(['sRGB', 0xba, 0xdb, 0xee]);
    });

    it("should throw if gets something it doesn't expect", () => {
      expect(() => sRGB.fromHex('rgba(255,255,255,1)')).toThrow();
    });
  });

  describe('uint32/uint24 conversion', () => {
    describe('fromUint32', () => {
      it('should load the correct bits', () => {
        const actual = sRGB.fromUint32(0xffffaa55);
        expect(actual).toStrictEqual(['sRGB', 0x55, 0xaa, 0xff, 1.0]);
      });

      it('should load the handle alpha', () => {
        const actual = sRGB.fromUint32(0x7fffaa55);
        expect(actual[4]).toBeCloseTo(0.49803);
      });
    });

    describe('toUint32', () => {
      it('should convert correctly back into a uint32', () => {
        const actual = sRGB.toUint32(['sRGB', 0x55, 0xaa, 0xff, 1.0]);
        expect(actual).toBe(0xffffaa55);
      });
    });

    it('should parse uint24 and ignore the alpha component', () => {
      const actual = sRGB.fromUint24(0x7f563412);
      expect(actual).toStrictEqual(['sRGB', 0x12, 0x34, 0x56]);
    });
  });
});

it('should doi something ', () => {
  // Parse from hex code
  const color1: sRGBTuple = sRGB.fromHex('#ff6347');

  // Parse from a uint32 in AABBGGRR byte order.
  const color2: sRGBTuple = sRGB.fromUint32(0xffed9564);

  // Mix color 1 and color 2 at 50% in sRGB color-space.
  const color3: sRGBTuple = sRGB.mix(color1, color2, 0.5);
  console.error(sRGB.toHex(color3));
});
