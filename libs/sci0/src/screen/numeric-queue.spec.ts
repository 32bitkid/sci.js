import { NumericQueue } from './numeric-queue';

describe('NumericQueue', () => {
  it('should work', () => {
    const queue = new NumericQueue(4);
    queue.push(1);
    queue.push(2);
    queue.push(3);
    queue.push(4);
    expect(queue.shift()).toBe(1);
    expect(queue.shift()).toBe(2);
    expect(queue.shift()).toBe(3);
    expect(queue.shift()).toBe(4);
  });

  it('should throw when pushing too much', () => {
    const queue = new NumericQueue(4);
    queue.push(1);
    queue.push(2);
    queue.push(3);
    queue.push(4);
    expect(() => queue.push(5)).toThrow();
  });

  it('should throw when exhaused', () => {
    const queue = new NumericQueue(4);
    queue.push(1);
    queue.shift();
    expect(() => queue.shift()).toThrow();
  });

  it('should be able to refill', () => {
    const queue = new NumericQueue(4);

    queue.push(1);
    queue.push(2);
    queue.push(3);
    expect(queue.shift()).toBe(1);
    expect(queue.shift()).toBe(2);
    expect(queue.shift()).toBe(3);

    queue.push(4);
    queue.push(5);
    queue.push(6);
    expect(queue.shift()).toBe(4);
    expect(queue.shift()).toBe(5);
    expect(queue.shift()).toBe(6);
  });

  it('should know when its empty', () => {
    const queue = new NumericQueue(4);
    expect(queue.isEmpty()).toBeTruthy();
    queue.push(1);
    expect(queue.isEmpty()).toBeFalsy();
    queue.shift();
    expect(queue.isEmpty()).toBeTruthy();
  });
});
