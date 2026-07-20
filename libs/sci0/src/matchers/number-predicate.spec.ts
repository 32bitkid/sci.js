import { describe, expect, it } from 'vitest';
import { matchResourceNumber } from './number-predicate';

describe('number matchers', () => {
  it('should match a single number', () => {
    const predicate = matchResourceNumber(0o144);
    expect(predicate({ id: 0o0, file: 0, offset: 0 })).toBe(false);

    expect(predicate({ id: 0o144, file: 0, offset: 0 })).toBe(true);
    expect(predicate({ id: 0o143, file: 0, offset: 0 })).toBe(false);
    expect(predicate({ id: 0o145, file: 0, offset: 0 })).toBe(false);

    expect(predicate({ id: 0o4143, file: 0, offset: 0 })).toBe(false);
    expect(predicate({ id: 0o4144, file: 0, offset: 0 })).toBe(true);
    expect(predicate({ id: 0o10143, file: 0, offset: 0 })).toBe(false);
    expect(predicate({ id: 0o10144, file: 0, offset: 0 })).toBe(true);

    expect(predicate({ id: 0o3777, file: 0, offset: 0 })).toBe(false);
  });

  it('should match *any* of the provided numbers', () => {
    const predicate = matchResourceNumber(0o144, 0o143, 0o145);
    expect(predicate({ id: 0o0, file: 0, offset: 0 })).toBe(false);

    expect(predicate({ id: 0o143, file: 0, offset: 0 })).toBe(true);
    expect(predicate({ id: 0o144, file: 0, offset: 0 })).toBe(true);
    expect(predicate({ id: 0o145, file: 0, offset: 0 })).toBe(true);

    expect(predicate({ id: 0o4143, file: 0, offset: 0 })).toBe(true);
    expect(predicate({ id: 0o4144, file: 0, offset: 0 })).toBe(true);
    expect(predicate({ id: 0o10143, file: 0, offset: 0 })).toBe(true);
    expect(predicate({ id: 0o10144, file: 0, offset: 0 })).toBe(true);

    expect(predicate({ id: 0o3777, file: 0, offset: 0 })).toBe(false);
  });

  it('should return false if nothing is given', () => {
    const predicate = matchResourceNumber();

    expect(predicate({ id: 0o143, file: 0, offset: 0 })).toBe(false);
    expect(predicate({ id: 0o144, file: 0, offset: 0 })).toBe(false);
    expect(predicate({ id: 0o145, file: 0, offset: 0 })).toBe(false);
  });
});
