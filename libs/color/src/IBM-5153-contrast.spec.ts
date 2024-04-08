import { IBM5153Contrast as contrast } from './IBM-5153-contrast';
import { CGA_PALETTE } from './palettes';

describe('IBM-5153 Dimmer', () => {
  it('should not change colors at 100%', () => {
    const pal = contrast(CGA_PALETTE, 1);
    expect(pal).toEqual(CGA_PALETTE);
  });

  it('should not adjust the top 8 colors', () => {
    const pal = contrast(CGA_PALETTE, 0.5);
    expect(pal.subarray(8)).toEqual(CGA_PALETTE.subarray(8));
  });

  it('should not adjust all the way to black', () => {
    const pal = contrast(CGA_PALETTE, 0);
    pal.subarray(1, 7).forEach((it) => expect(it).not.toBe(0xff000000));
  });
});
