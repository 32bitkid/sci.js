import { BitReader } from './bit-reader';

describe('ArrayBufferBitReader', () => {
  describe('peek', () => {
    describe('with a buffer with all zeroes', () => {
      const bytes = new ArrayBuffer(4);
      it.each<[number, number]>(
        Array(31)
          .fill(0)
          .map((_, i) => [0, i + 1]),
      )('should return %s when peeking %s bits', (expected, n) => {
        const br = new BitReader(bytes);
        expect(br.peek32(n)).toBe(expected);
      });
    });

    describe('with a buffer with all ones', () => {
      const bytes = Uint8Array.from(Array(4).fill(0xff)).buffer;
      it.each<[number, number]>(
        Array(32)
          .fill(0)
          .map((_, i) => [2 ** i - 1, i]),
      )('should return %s when peeking %s bits', (expected, n) => {
        const br = new BitReader(bytes);
        expect(br.peek32(n)).toBe(expected);
      });
    });

    it('should peek different lengths into a byte', () => {
      const bytes = [0b1000_1000];
      const br = new BitReader(Uint8Array.from(bytes).buffer);
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
      const br = new BitReader(Uint8Array.from(data).buffer);
      br.skip(n);
      expect(br.peek32(1)).toBe(1);
    });

    it('should handle multiple fills', () => {
      const data = Array(8).fill(0);
      data[4] = 0b0000_1000;
      const br = new BitReader(Uint8Array.from(data).buffer);
      br.skip(4);
      br.skip(32);
      expect(br.peek32(1)).toBe(1);
    });
  });

  describe('read', () => {
    it.each<[number, number[]]>([
      [0, [0b1000_0000, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [3, [0b0001_0000, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [7, [0b0000_0001, 0b0000_0000, 0b0000_0000, 0b0000_0000]],
      [12, [0b0000_0000, 0b0000_1000, 0b0000_0000, 0b0000_0000]],
      [31, [0b0000_0000, 0b0000_0000, 0b0000_0000, 0b0000_0001]],
    ])('should skip %s bits', (n, data) => {
      const br = new BitReader(Uint8Array.from(data).buffer);
      expect(br.read32(n)).toBe(0);
      expect(br.read32(1)).toBe(1);
      expect(br.read32(32 - n - 1)).toBe(0);
    });
  });

  describe('seek', () => {
    it('should move around', () => {
      const data = new Uint8Array(64);
      data[0] = 0b1000_0000;
      data[16] = 0b1000_0000;
      data[22] = 0b0000_1000;
      data[60] = 0b0010_0000;

      const br = new BitReader(data.buffer);
      expect(br.seek(16).peek32(1)).toBe(1);
      expect(br.seek(22).skip(4).peek32(1)).toBe(1);
      expect(br.seek(60).skip(2).peek32(1)).toBe(1);
      expect(br.seek(0).peek32(1)).toBe(1);
    });
  });

  describe('alignment', () => {
    it('should know when its aligned', () => {
      const br = new BitReader(new ArrayBuffer(8));
      expect(br.isByteAligned()).toBeTruthy();
      expect(br.skip(10).isByteAligned()).toBeFalsy();
      expect(br.skip(6).isByteAligned()).toBeTruthy();
      expect(br.skip(32).isByteAligned()).toBeTruthy();
      expect(br.skip(3).isByteAligned()).toBeFalsy();
    });

    it('align itself to the next byte', () => {
      const br = new BitReader(
        Uint8Array.from([
          0b1000_0000, 0b0000_0000, 0b1000_0000, 0b0000_0000, 0b0000_0000,
          0b1000_0000,
        ]).buffer,
      );
      expect(br.align().peek32(1)).toBe(1);
      expect(br.skip(1).align().peek32(1)).toBe(0);
      expect(br.skip(8).align().peek32(1)).toBe(1);
      expect(br.skip(22).align().peek32(1)).toBe(1);
    });
  });
});
