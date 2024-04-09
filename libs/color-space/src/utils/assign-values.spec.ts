import { assign } from './assign-values';

describe('setValues()', () => {
  type UnknownColor = ['unknown', number, number, number, number?];

  it('should update alpha', () => {
    const current: UnknownColor = ['unknown', 0, 0, 0, 1.0];
    const actual = assign(current, 1, 2, 3, 0.5);
    expect(actual).toBe(current);
    expect(actual).toStrictEqual(['unknown', 1, 2, 3, 0.5]);
  });

  it('should set the alpha if was missing', () => {
    const current: UnknownColor = ['unknown', 1, 2, 3];
    const actual = assign(current, 4, 5, 6, 0.5);
    expect(actual).toBe(current);
    expect(actual).toStrictEqual(['unknown', 4, 5, 6, 0.5]);
  });

  it('should remove the alpha if its unspecified now', () => {
    const current: UnknownColor = ['unknown', 1, 2, 3, 1];
    const actual = assign(current, 0, 0, 0, undefined);
    expect(actual).toBe(current);
    expect(actual).toStrictEqual(['unknown', 0, 0, 0]);
  });

  it('should skip values that are undefined', () => {
    const current: UnknownColor = ['unknown', 1, 2, 3];
    const actual = assign(current, undefined, 0, undefined, 1.0);
    expect(actual).toBe(current);
    expect(actual).toStrictEqual(['unknown', 1, 0, 3, 1.0]);
  });
});
