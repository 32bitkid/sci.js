import { IBM5153Dimmer as dimmer } from './IBM-5153-dimmer';
import { RAW_CGA } from './cga-palette';

describe('IBM-5153 Dimmer', () => {
  it('should not change colors at 100%', () => {
    const pal = dimmer(RAW_CGA, 1);
    expect(pal).toEqual(RAW_CGA);
  });

  it('should not adjust the top 8 colors', () => {
    const pal = dimmer(RAW_CGA, 0.5);
    expect(pal.subarray(8)).toEqual(RAW_CGA.subarray(8));
  });

  it('should not adjust all the way to black', () => {
    const pal = dimmer(RAW_CGA, 0);
    pal.subarray(1, 7).forEach((it) => expect(it).not.toBe(0xff000000));
  });

  it('even at 0 brightness, EGA 7 should be lighter than EGA 8', () => {
    const pal = dimmer(RAW_CGA, 0);
    expect(pal[7]).toBeGreaterThan(pal[8]);
  });
});
