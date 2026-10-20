import { describe, expect, it } from 'vitest';

import { generatePairs } from '@4bitlabs/color/dithers';
import { createDitherFilter } from './dither-filter.js';
import { createIndexedPixelData } from './indexed-pixel-data.js';

describe('dither-filter', () => {
  it('should dither', () => {
    const img = createIndexedPixelData(2, 2);
    img.pixels[0] = 0x01;
    img.pixels[1] = 0x01;
    img.pixels[2] = 0x01;
    img.pixels[3] = 0x01;

    const filter = createDitherFilter(
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
        4278190080,
        4294967295,
      ]
    `);
  });
});
