import { it, expect, describe } from 'vitest';
import { createIndexedPixelData } from './indexed-pixel-data.js';
import { generatePairs } from '@4bitlabs/color/dithers';
import { createPatternFilter } from './pattern-filter.js';

describe('pattern-filter', () => {
  it('should dither', () => {
    const img = createIndexedPixelData(4, 4);
    for (let i = 0; i < 16; i++) img.pixels[i] = 0x01;

    const filter = createPatternFilter(
      generatePairs(Uint32Array.of(0xff_00_00_00, 0xff_ff_ff_ff)),
    );
    const result = filter(img);
    expect(
      new Uint32Array(
        result.data.buffer,
        result.data.byteOffset,
        result.data.byteLength / 4,
      ),
    ).toMatchInlineSnapshot(`
      Uint32Array [
        4294967295,
        4278190080,
        4294967295,
        4278190080,
        4278190080,
        4294967295,
        4278190080,
        4294967295,
        4294967295,
        4278190080,
        4294967295,
        4278190080,
        4278190080,
        4294967295,
        4278190080,
        4294967295,
      ]
    `);
  });
});
