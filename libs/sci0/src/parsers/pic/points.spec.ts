import { createBitReader } from '@4bitlabs/readers';

import { getPoint8, getPoint16, getPoint24 } from './points';
import { Vec2, vec2 } from '../../models/vec2';

describe('point readers', () => {
  describe('getPoint8', () => {
    it.each<[[number], Vec2, Vec2]>([
      [[0b0000_0000], [0, 0], [0, 0]],
      [[0b0001_0000], [0, 0], [1, 0]],
      [[0b0000_0001], [0, 0], [0, 1]],
      [[0b0001_0001], [0, 0], [1, 1]],

      [[0b1001_1000], [0, 0], [-1, 0]],
      [[0b1000_1001], [0, 0], [0, -1]],
      [[0b1001_1001], [0, 0], [-1, -1]],

      [[0b0111_0111], [0, 0], [7, 7]],
      [[0b1111_1111], [0, 0], [-7, -7]],

      [[0b0001_0000], [150, 150], [151, 150]],
      [[0b0000_0001], [150, 150], [150, 151]],
      [[0b0001_0001], [150, 150], [151, 151]],
      [[0b1001_0000], [150, 150], [149, 150]],
      [[0b0000_1001], [150, 150], [150, 149]],
      [[0b1001_1001], [150, 150], [149, 149]],
    ])('with the value of %s from %s should be %s', (bits, ref, expected) => {
      const br = createBitReader(Uint8Array.from(bits));
      const out = vec2.create();
      getPoint8(br, out, ref);
      expect(out).toEqual(vec2.copy(vec2.create(), expected));
    });
  });

  describe('getPoint16', () => {
    it.each<[[number, number], Vec2, Vec2]>([
      [
        [0x00, 0x00],
        [0, 0],
        [0, 0],
      ],
      [
        [0x00, 0x01],
        [0, 0],
        [1, 0],
      ],
      [
        [0x01, 0x00],
        [0, 0],
        [0, 1],
      ],
      [
        [0x01, 0x01],
        [0, 0],
        [1, 1],
      ],

      [
        [0x7f, 0x7f],
        [0, 0],
        [127, 127],
      ],

      [
        [0xff, 0x81],
        [127, 127],
        [0, 0],
      ],

      [
        [0x00, 0xff],
        [0, 0],
        [-1, 0],
      ],
      [
        [0x81, 0x00],
        [0, 0],
        [0, -1],
      ],
      [
        [0x81, 0xff],
        [0, 0],
        [-1, -1],
      ],

      [
        [0x00, 0x01],
        [150, 150],
        [151, 150],
      ],
      [
        [0x01, 0x00],
        [150, 150],
        [150, 151],
      ],
      [
        [0x01, 0x01],
        [150, 150],
        [151, 151],
      ],
      [
        [0x00, 0xff],
        [150, 150],
        [149, 150],
      ],
      [
        [0x81, 0x00],
        [150, 150],
        [150, 149],
      ],
      [
        [0x81, 0xff],
        [150, 150],
        [149, 149],
      ],
    ])('with the value of %s from %s should be %s', (bits, ref, expected) => {
      const br = createBitReader(Uint8Array.from(bits));
      const out = vec2.create();
      getPoint16(br, out, ref);
      expect(out).toEqual(vec2.copy(vec2.create(), expected));
    });
  });

  describe('getPoint16', () => {
    it.each<[[number, number, number], Vec2]>([
      [
        [0x00, 0x00, 0x00],
        [0, 0],
      ],
      [
        [0x00, 0x01, 0x00],
        [1, 0],
      ],
      [
        [0x00, 0x00, 0x01],
        [0, 1],
      ],
      [
        [0x00, 0x01, 0x01],
        [1, 1],
      ],
      [
        [0x00, 0xff, 0x00],
        [255, 0],
      ],
      [
        [0x10, 0x2c, 0x01],
        [300, 1],
      ],
      [
        [0x10, 0x2c, 0x01],
        [300, 1],
      ],
    ])('with the value of %s should be %s', (bits, expected) => {
      const br = createBitReader(Uint8Array.from(bits));
      const out = vec2.create();
      getPoint24(br, out);
      expect(out).toEqual(vec2.copy(vec2.create(), expected));
    });
  });
});
