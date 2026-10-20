import { it, expect } from 'vitest';
import { p8, p16, plineMaxDelta } from './point-encoders.js';

it('should encode a p8', () => {
  expect(p8([0, 0])).toStrictEqual(Uint8Array.of(0b0000_0000));
  expect(p8([7, 7])).toStrictEqual(Uint8Array.of(0b0111_0111));
  expect(p8([10, 10])).toStrictEqual(Uint8Array.of(0b0111_0111));
  expect(p8([-5, 3])).toStrictEqual(Uint8Array.of(0b1101_0011));
  expect(p8([5, -3])).toStrictEqual(Uint8Array.of(0b0101_1011));
});

it('should encode a p16', () => {
  expect(p16([0, 0])).toStrictEqual(Uint8Array.of(0b0000_0000, 0b0000_0000));
  expect(p16([0, 15])).toStrictEqual(Uint8Array.of(0b0000_1111, 0b0000_0000));
  expect(p16([0, -15])).toStrictEqual(Uint8Array.of(0b1000_1111, 0b0000_0000));
  expect(p16([0, -127])).toStrictEqual(Uint8Array.of(0b1111_1111, 0b0000_0000));
  expect(p16([0, 127])).toStrictEqual(Uint8Array.of(0b0111_1111, 0b0000_0000));
  expect(p16([1, 0])).toStrictEqual(Uint8Array.of(0b0000_0000, 0b0000_0001));
  expect(p16([-1, 0])).toStrictEqual(Uint8Array.of(0b0000_0000, 0b1111_1111));
  expect(p16([-16, 0])).toStrictEqual(Uint8Array.of(0b0000_0000, 0b1111_0000));
});

it('should figure out delta', () => {
  expect(
    plineMaxDelta([
      [160, 100],
      [161, 101],
      [160, 101],
      [159, 101],
    ]),
  ).toBe(1);

  expect(
    plineMaxDelta([
      [160, 100],
      [120, 100],
      [160, 100],
      [160, 80],
    ]),
  ).toBe(40);
});
