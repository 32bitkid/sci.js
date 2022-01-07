import { AsyncBitReader } from './async-bit-reader';
import { Readable } from 'stream';
import { BitReader } from './bit-reader';

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
      )('should return %s when peeking %s bits', async (expected, n) => {
        const br = new AsyncBitReader(readerOf(Uint8Array.of(0x00), Infinity));
        expect(await br.peek32(n)).toBe(expected);
      });
    });

    describe('with a buffer with all ones', () => {
      it.each<[number, number]>(
        Array(32)
          .fill(0)
          .map((_, i) => [2 ** i - 1, i]),
      )('should return %s when peeking %s bits', async (expected, n) => {
        const br = new AsyncBitReader(readerOf(Uint8Array.of(0xff), Infinity));
        expect(await br.peek32(n)).toBe(expected);
      });
    });

    it('should peek different lengths into a byte', async () => {
      const bytes = [0b1000_1000];
      const br = new AsyncBitReader(readerOf(Uint8Array.from(bytes)));
      expect(await br.peek32(1)).toBe(0b1);
      expect(await br.peek32(2)).toBe(0b10);
      expect(await br.peek32(3)).toBe(0b100);
      expect(await br.peek32(4)).toBe(0b1000);
      expect(await br.peek32(5)).toBe(0b1000_1);
      expect(await br.peek32(6)).toBe(0b1000_10);
      expect(await br.peek32(7)).toBe(0b1000_100);
      expect(await br.peek32(8)).toBe(0b1000_1000);
    });
  });

  describe('skip', () => {
    it.each<[number, number[]]>([
      [0, [0b1000_0000, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [3, [0b0001_0000, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [7, [0b0000_0001, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [16, [0b0000_0000, 0b0000_0000, 0b1000_0000, 0b0000_0000]],
      [31, [0b0000_0000, 0b0000_0000, 0b0000_0000, 0b0000_0001]],
    ])('should skip %s bits', async (n, data) => {
      const br = new AsyncBitReader(readerOf(Uint8Array.from(data)));
      await br.skip(n);
      expect(await br.peek32(1)).toBe(1);
    });

    it('should handle multiple fills', async () => {
      const data = Array(8).fill(0);
      data[4] = 0b0000_1000;
      const br = new AsyncBitReader(readerOf(Uint8Array.from(data)));
      await br.skip(4);
      await br.skip(32);
      expect(await br.peek32(1)).toBe(1);
    });
  });

  describe('read', () => {
    it.each<[number, number[]]>([
      [0, [0b1000_0000, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [3, [0b0001_0000, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [7, [0b0000_0001, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [12, [0b0000_0000, 0b0000_1000, 0b0000_0000, 0b0000_0000]],
      [31, [0b0000_0000, 0b0000_0000, 0b0000_0000, 0b0000_0001]],
    ])('should skip %s bits', async (n, data) => {
      const br = new AsyncBitReader(readerOf(Uint8Array.from(data)));
      expect(await br.read32(n)).toBe(0);
      expect(await br.read32(1)).toBe(1);
      expect(await br.read32(32 - n - 1)).toBe(0);
    });
  });

  describe('alignment', () => {
    it('should know when its aligned', async () => {
      const br = new AsyncBitReader(readerOf(new Uint8Array(8)));
      expect(br.isByteAligned()).toBeTruthy();
      await br.skip(10);
      expect(br.isByteAligned()).toBeFalsy();
      await br.skip(6);
      expect(br.isByteAligned()).toBeTruthy();
      await br.skip(32);
      expect(br.isByteAligned()).toBeTruthy();
      await br.skip(3);
      expect(br.isByteAligned()).toBeFalsy();
    });

    it('align itself to the next byte', async () => {
      const bytes = Uint8Array.from([
        0b1000_0000, 0b0000_0000, 0b1000_0000, 0b0000_0000, 0b0000_0000,
        0b1000_0000,
      ]);
      const br = new AsyncBitReader(readerOf(bytes));
      br.align();
      expect(await br.peek32(1)).toBe(1);
      await br.skip(1);
      br.align();
      expect(await br.peek32(1)).toBe(0);
      await br.skip(8);
      br.align();
      expect(await br.peek32(1)).toBe(1);
      await br.skip(22);
      br.align();
      expect(await br.peek32(1)).toBe(1);
    });
  });
});
