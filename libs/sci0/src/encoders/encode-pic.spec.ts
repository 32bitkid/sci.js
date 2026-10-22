import { it, expect, describe } from 'vitest';
import { encodePic } from './encode-pic.js';
import type { Pic } from '../models/pic.js';
import { parsePic } from '../parsers/parse-pic.js';

const toHex = (source: Uint8Array): string =>
  Array.from(source)
    .map((it) => it.toString(16).padStart(2, '0'))
    .join('');

it('should encode', () => {
  const data = [
    ['SET_VISUAL', 1],
    ['FILL', [172, 113]],
  ] satisfies Pic;
  const bytes = encodePic(data);
  expect(toHex(bytes)).toMatchInlineSnapshot(`"f001f800ac71ff"`);
});

describe('roundtrips', () => {
  it('lines and fills', () => {
    const data = [
      ['CLEAR_VISUAL'],
      ['PLINE', [0, 64], [15, 64], [15, 79], [0, 79], [0, 64]],
      ['FILL', [8, 72]],
    ] satisfies Pic;
    const bytes = encodePic(data);
    const result = parsePic(bytes);
    expect(result).toStrictEqual(data);
  });

  it('palettes', () => {
    const pal = [
      0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb,
      0xcc, 0xdd, 0xee, 0x88, 0x88, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x88,
      0x88, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff, 0x08, 0x91, 0x2a, 0x3b,
      0x4c, 0x5d, 0x6e, 0x88,
    ];
    const data = [
      ['CLEAR_VISUAL'],
      ['SET_PALETTE', 0, ...pal],
      ['PLINE', [0, 64], [15, 64], [15, 79], [0, 79], [0, 64]],
      ['FILL', [8, 72]],
    ] satisfies Pic;
    const bytes = encodePic(data);
    const result = parsePic(bytes);
    expect(result).toStrictEqual(data);
  });
});
