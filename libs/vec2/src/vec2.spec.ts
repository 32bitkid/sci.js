import {
  type Vec2,
  vec2,
  clone,
  set,
  round,
  add,
  sub,
  scale,
  isEqual,
  project,
  length,
  squaredLength,
  squaredDistanceBetween,
  distanceBetween,
  toString,
} from './vec2';

describe('vec2', () => {
  describe('cloning', () => {
    it('should make a clone', () => {
      const v1 = vec2(20, 30);
      const v2 = clone(v1);
      set(-10, -20, v1);
      expect(v1).toStrictEqual([-10, -20]);
      expect(v2).toStrictEqual([20, 30]);
    });
  });

  describe('rounding', () => {
    it('should return a new vec2', () => {
      const v = vec2(1.5, 3.1);
      const result = round(v);
      expect(v).not.toBe(result);
      expect(result).toStrictEqual([2, 3]);
    });

    it('should be able to round in place', () => {
      const v = vec2(1.5, 3.1);
      const result = round(v, v);
      expect(v).toBe(result);
      expect(v).toStrictEqual([2, 3]);
    });

    it('should be able to use another method', () => {
      const v = vec2(1.9, 3.9);
      const result = round(v, vec2(), Math.floor);
      expect(result).toStrictEqual([1, 3]);
    });
  });

  describe('maths', () => {
    it('should add vectors', () => {
      const a = vec2(2, 4);
      const b = vec2(5, 1);
      const out = vec2();
      add(a, b, out);
      expect(out).toStrictEqual([7, 5]);
    });

    it('should subtract b from a', () => {
      const a = vec2(2, 4);
      const b = vec2(5, 1);
      const out = vec2();
      sub(a, b, out);
      expect(out).toStrictEqual([-3, 3]);
    });

    it('should scale', () => {
      const a = vec2(2, 4);
      const out = vec2();
      scale(a, 3.3, out);
      expect(out).toStrictEqual([6.6, 13.2]);
    });
  });

  describe('comparison', () => {
    it('should be equal', () => {
      expect(isEqual(vec2(2, 2), vec2(2, 2))).toBe(true);
      expect(isEqual(vec2(2, 1.9), vec2(2, 2))).toBe(false);
      expect(isEqual(vec2(1.9, 2), vec2(2, 2))).toBe(false);
      expect(isEqual(vec2(1.9, 1.9), vec2(2, 2))).toBe(false);
    });
  });

  describe('length', () => {
    it('should return length', () => {
      expect(length(vec2(1, 1))).toBe(Math.SQRT2);
    });

    it('should return squared-length', () => {
      expect(squaredLength(vec2(1, 1))).toBe(2);
    });

    it('should return length between two vectors', () => {
      const actual = distanceBetween(vec2(9.2, 3.6), vec2(10.2, 4.6));
      expect(actual).toBeCloseTo(Math.SQRT2, 10);
    });

    it('should return squared-length', () => {
      const actual = squaredDistanceBetween(vec2(9.2, 3.6), vec2(10.2, 4.6));
      expect(actual).toBeCloseTo(2, 10);
    });
  });

  describe('projection', () => {
    it.each<[A: Vec2, B: Vec2, p: Vec2, expected: Vec2]>([
      [vec2(-10, 0), vec2(10, 0), vec2(0, 2), vec2(0, 0)],
      [vec2(0, 0), vec2(10, 10), vec2(10, 0), vec2(5, 5)],
      [vec2(-10, 0), vec2(10, 0), vec2(-100, 0), vec2(-10, 0)],
      [vec2(-10, 0), vec2(10, 0), vec2(100, 0), vec2(10, 0)],
    ])('should project point P onto line-segment AB', (A, B, p, expected) => {
      const out = vec2();
      project(A, B, p, out);
      expect(out).toStrictEqual(expected);
    });
  });

  describe('stringification', () => {
    it('should convert to string', () => {
      expect(toString(vec2(1.5, 3.9))).toBe(`(1.5, 3.9)`);
    });

    it(`should use angle-brackets… if you are a madman…`, () => {
      expect(toString(vec2(1.5, 3.9), { angleBrackets: true })).toBe(
        `⟨1.5, 3.9⟩`,
      );
    });
  });
});
