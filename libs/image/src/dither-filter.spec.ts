import { generatePairs } from '@4bitlabs/color/dithers';
import { createDitherFilter } from './dither-filter';
import { createIndexedPixelData } from './indexed-pixel-data';

describe('dither-filter', () => {
  it('should dither', () => {
    const img = createIndexedPixelData(2, 2);
    img.pixels[0] = 0x01;
    img.pixels[1] = 0x01;
    img.pixels[2] = 0x01;
    img.pixels[3] = 0x01;

    const filter = createDitherFilter(
      generatePairs(Uint32Array.of(0xff_00_00_00, 0xff_ff_00_00)),
    );
    const result = filter(img);
    expect(result.data).toEqual(
      // prettier-ignore
      Uint8ClampedArray.of(
        0, 0, 0xff, 0xff, 0, 0,    0, 0xff,
        0, 0,    0, 0xff, 0, 0, 0xff, 0xff,
      ),
    );
  });
});
