import { NumericDeque } from './numeric-deque';

describe('NumericDeque', () => {
  it('should pop values off the front of the deque', () => {
    const d = new NumericDeque(4);
    d.push(1);
    d.push(2);
    d.push(3);
    d.push(4);
    expect(d.pop()).toBe(4);
    expect(d.pop()).toBe(3);
    expect(d.pop()).toBe(2);
    expect(d.pop()).toBe(1);
  });

  it('should shift values off the front of the deque', () => {
    const d = new NumericDeque(4);
    d.push(1);
    d.push(2);
    d.push(3);
    d.push(4);
    expect(d.shift()).toBe(1);
    expect(d.shift()).toBe(2);
    expect(d.shift()).toBe(3);
    expect(d.shift()).toBe(4);
  });

  it('should unshift values onto the front of the deque', () => {
    const d = new NumericDeque(4);
    d.unshift(1);
    d.unshift(2);
    d.unshift(3);
    d.unshift(4);
    expect(d.pop()).toBe(1);
    expect(d.pop()).toBe(2);
    expect(d.pop()).toBe(3);
    expect(d.pop()).toBe(4);
  });

  describe('push', () => {
    it('should throw when full', () => {
      const d = new NumericDeque(4);
      d.push(1);
      d.push(2);
      d.push(3);
      d.push(4);
      expect(() => { d.push(5); }).toThrow();
    });
  });

  describe('unshift', () => {
    it('should throw when full', () => {
      const d = new NumericDeque(4);
      d.unshift(1);
      d.unshift(2);
      d.unshift(3);
      d.unshift(4);
      expect(() => { d.unshift(5); }).toThrow();
    });
  });

  describe('shift', () => {
    it('should throw when exhausted', () => {
      const d = new NumericDeque(4);
      d.push(1);
      d.shift();
      expect(() => d.shift()).toThrow();
    });
  });

  describe('pop', () => {
    it('should throw when exhausted', () => {
      const d = new NumericDeque(4);
      d.push(1);
      d.pop();
      expect(() => d.pop()).toThrow();
    });
  });

  it('should be able to refill', () => {
    const d = new NumericDeque(4);

    d.push(1);
    d.push(2);
    d.push(3);
    expect(d.shift()).toBe(1);
    expect(d.pop()).toBe(3);
    expect(d.shift()).toBe(2);

    d.push(4);
    d.push(5);
    d.push(6);
    expect(d.pop()).toBe(6);
    expect(d.shift()).toBe(4);
    expect(d.pop()).toBe(5);
  });

  it('should know when its empty', () => {
    const d = new NumericDeque(4);
    expect(d.isEmpty()).toBeTruthy();
    d.push(1);
    expect(d.isEmpty()).toBeFalsy();
    d.shift();
    expect(d.isEmpty()).toBeTruthy();
    d.unshift(1);
    expect(d.isEmpty()).toBeFalsy();
    d.pop();
    expect(d.isEmpty()).toBeTruthy();
  });

  it('should be able to peek at the ends', () => {
    const d = new NumericDeque(4);
    d.push(1);
    d.push(2);
    d.push(3);
    d.push(4);

    expect(d.peekHead()).toBe(1);
    expect(d.peekTail()).toBe(4);
  });

  describe('TypedArray', () => {
    it('should respect other typed-arrays', () => {
      const d = new NumericDeque(10, Uint8ClampedArray);
      d.push(400);
      expect(d.pop()).toBe(255);
      d.push(-50);
      expect(d.pop()).toBe(0);
    });
  });
});
