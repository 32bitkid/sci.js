import { describe, it, expect } from 'vitest';
import { windingOrderOf } from './winding-order';

describe('winding-order', () => {
  it('should detect mathematical winding order', () => {
    expect(
      windingOrderOf([
        [0, 0],
        [10, 0],
        [10, 10],
        [10, 0],
      ]),
    ).toBe('ccw');
  });
});
