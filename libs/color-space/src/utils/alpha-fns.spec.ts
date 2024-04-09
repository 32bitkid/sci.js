import { alphaPart } from './alpha-fns';

describe('alphaPart()', () => {
  it('should emit nothing if alpha is undefined', () => {
    expect(alphaPart(undefined)).toBe('');
  });

  it('should emit the alpha', () => {
    expect(alphaPart(0.5)).toBe(' / 0.5');
  });

  it('should emit the even if its zero', () => {
    expect(alphaPart(0.0)).toBe(' / 0');
  });

  it('should clamp the alpha to the range of [0,1]', () => {
    expect(alphaPart(-1)).toBe(' / 0');
    expect(alphaPart(2)).toBe(' / 1');
  });
});
