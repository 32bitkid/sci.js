import { BitReader } from './bit-reader';
import { Readable } from 'stream';

const readerOf = (bytes: Uint8Array | number[], times = 1): Readable => {
  let count = 0;
  return new Readable({
    read() {
      if (count >= times) return null;
      this.push(bytes);
      count += 1;
    },
  });
};

describe('BitReader', () => {
  describe('peek', () => {
    describe('with a buffer with all zeroes', () => {
      it.each<[number, number]>(
        Array(32)
          .fill(0)
          .map((_, i) => [0, i]),
      )('should return %s when peeking %s bits', (expected, n) => {
        const br = new BitReader(readerOf(Uint8Array.of(0x00), Infinity));
        expect(br.peek32(n)).toBe(expected);
      });
    });

    describe('with a buffer with all ones', () => {
      it.each<[number, number]>(
        Array(32)
          .fill(0)
          .map((_, i) => [2 ** i - 1, i]),
      )('should return %s when peeking %s bits', (expected, n) => {
        const br = new BitReader(readerOf(Uint8Array.of(0xff), Infinity));
        expect(br.peek32(n)).toBe(expected);
      });
    });

    it('should peek different lengths into a byte', () => {
      const bytes = [0b1000_1000];
      const br = new BitReader(readerOf(Uint8Array.from(bytes)));
      expect(br.peek32(1)).toBe(0b1);
      expect(br.peek32(2)).toBe(0b10);
      expect(br.peek32(3)).toBe(0b100);
      expect(br.peek32(4)).toBe(0b1000);
      expect(br.peek32(5)).toBe(0b1000_1);
      expect(br.peek32(6)).toBe(0b1000_10);
      expect(br.peek32(7)).toBe(0b1000_100);
      expect(br.peek32(8)).toBe(0b1000_1000);
    });
  });

  describe('skip', () => {
    it.each<[number, number[]]>([
      [0, [0b1000_0000, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [3, [0b0001_0000, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [7, [0b0000_0001, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [16, [0b0000_0000, 0b0000_0000, 0b1000_0000, 0b0000_0000]],
      [31, [0b0000_0000, 0b0000_0000, 0b0000_0000, 0b0000_0001]],
    ])('should skip %s bits', (n, data) => {
      const br = new BitReader(readerOf(Uint8Array.from(data)));
      br.skip(n);
      expect(br.peek32(1)).toBe(1);
    });

    it('should handle multiple fills', () => {
      const data = Array(8).fill(0);
      data[4] = 0b0000_1000;
      const br = new BitReader(readerOf(Uint8Array.from(data)));
      br.skip(4);
      br.skip(32);
      expect(br.peek32(1)).toBe(1);
    });
  });

  describe('alignment', () => {
    it('should know when its aligned', () => {
      const br = new BitReader(readerOf(new Uint8Array(8)));
      expect(br.isByteAligned()).toBeTruthy();
      expect(br.skip(10).isByteAligned()).toBeFalsy();
      expect(br.skip(6).isByteAligned()).toBeTruthy();
      expect(br.skip(32).isByteAligned()).toBeTruthy();
      expect(br.skip(3).isByteAligned()).toBeFalsy();
    });

    it('align itself to the next byte', () => {
      const bytes = Uint8Array.from([
        0b1000_0000, 0b0000_0000, 0b1000_0000, 0b0000_0000, 0b0000_0000,
        0b1000_0000,
      ]);
      const br = new BitReader(readerOf(bytes));
      expect(br.align().peek32(1)).toBe(1);
      expect(br.skip(1).align().peek32(1)).toBe(0);
      expect(br.skip(8).align().peek32(1)).toBe(1);
      expect(br.skip(22).align().peek32(1)).toBe(1);
    });
  });
});
