import { describe, expect, it } from 'vitest';
import { match } from './type-and-number-predicate.js';
import { PIC_TYPE } from '../models/resource-types.js';

describe('number matchers', () => {
  it('should match a single number', () => {
    const predicate = match({ number: 0o144, type: PIC_TYPE });
    expect(predicate({ id: 0o144, file: 0, offset: 0 })).toBe(false);
    expect(predicate({ id: 0o4143, file: 0, offset: 0 })).toBe(false);
    expect(predicate({ id: 0o4144, file: 0, offset: 0 })).toBe(true);
    expect(predicate({ id: 0o4145, file: 0, offset: 0 })).toBe(false);
    expect(predicate({ id: 0o10144, file: 0, offset: 0 })).toBe(false);
  });
});
