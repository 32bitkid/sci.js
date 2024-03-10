import { MsbReader } from './msb-reader';
import { FastMsbReader } from './fast-msb-reader';
import { LsbReader } from './lsb-reader';
import { FastLsbReader } from './fast-lsb-reader';

describe.each([
  ['MsbReader', MsbReader],
  ['FastMsbReader', FastMsbReader],
])('Most-Significant Bit first: %s', (_, BitReader) => {
  describe('peek', () => {
    describe('with a buffer with all zeroes', () => {
      const bytes = new Uint8Array(4);
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
      const bytes = Uint8Array.from(Array(4).fill(0xff));
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
      const br = new BitReader(Uint8Array.from(bytes));
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
      const br = new BitReader(Uint8Array.from(data));
      br.skip(n);
      expect(br.peek32(1)).toBe(1);
    });

    it('should handle multiple fills', () => {
      const data = Array(8).fill(0);
      data[4] = 0b0000_1000;
      const br = new BitReader(Uint8Array.from(data));
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
      const br = new BitReader(Uint8Array.from(data));
      expect(br.read32(n)).toBe(0);
      expect(br.read32(1)).toBe(1);
      expect(br.read32(32 - n - 1)).toBe(0);
    });

    it('should read 11 bytes without going bonkers', () => {
      const br = new BitReader(
        Uint8Array.of(
          0b0000_0000,
          0b1000_0000,
          0b0100_0000,
          0b0010_0000,
          0b0001_0000,
          0b0000_1000,
          0b0000_0100,
          0b0000_0010,
          0b0000_0001,
          0b0000_0000,
          0b1000_0000,
        ),
      );
      expect(br.read32(9)).toBe(1);
      expect(br.read32(9)).toBe(1);
      expect(br.read32(9)).toBe(1);
      expect(br.read32(9)).toBe(1);
      expect(br.read32(9)).toBe(1);
      expect(br.read32(9)).toBe(1);
      expect(br.read32(9)).toBe(1);
      expect(br.read32(9)).toBe(1);
      expect(br.read32(9)).toBe(1);
    });
  });

  describe('seek', () => {
    it('should move around', () => {
      const data = new Uint8Array(64);
      data[0] = 0b1000_0000;
      data[16] = 0b1000_0000;
      data[22] = 0b0000_1000;
      data[60] = 0b0010_0000;

      const br = new BitReader(data);
      expect(br.seek(16).peek32(1)).toBe(1);
      expect(br.seek(22).skip(4).peek32(1)).toBe(1);
      expect(br.seek(60).skip(2).peek32(1)).toBe(1);
      expect(br.seek(0).peek32(1)).toBe(1);
    });
  });

  describe('alignment', () => {
    it('should know when its aligned', () => {
      const br = new BitReader(new Uint8Array(8));
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
        ]),
      );
      expect(br.skip(0).align().peek32(1)).toBe(1);
      expect(br.skip(1).align().peek32(1)).toBe(0);
      expect(br.skip(8).align().peek32(1)).toBe(1);
      expect(br.skip(22).align().peek32(1)).toBe(1);
    });
  });

  it('should read 32 bits across byte boundaries', () => {
    const br = new BitReader(
      // prettier-ignore
      Uint8Array.from([
        0b0000_0000, 0b0000_0000, 0b0000_0000, 0b0000_0000,
        0b1000_0000, 0b0000_0000, 0b0000_0000, 0b1000_0000,
      ]),
    );

    br.skip(1);
    expect(br.read32(32)).toBe(1);
  });
});

describe.each([
  ['LsbReader', LsbReader],
  ['FastLsbReader', FastLsbReader],
])('Least-Significant Bit First: %s', (_, BitReader) => {
  it('should peek', () => {
    const data = Uint8Array.of(0b1100_1111);
    const r = new BitReader(data);
    expect(r.peek32(4)).toBe(0b1111);
  });

  it('should read across bytes', () => {
    const data = Uint8Array.of(0b0000_0011, 0b0000_1100);
    const r = new BitReader(data);
    expect(r.read32(2)).toBe(0b11);
    expect(r.read32(8)).toBe(0b0000_0000);
    expect(r.read32(2)).toBe(0b11);
    expect(r.read32(2)).toBe(0b0000);
  });

  it('should read across bytes 2', () => {
    const data = Uint8Array.of(0b0000_0000, 0b0000_0001);
    const r = new BitReader(data);
    expect(r.read32(9)).toBe(0b1_0000_0000);
  });

  it('should read across bytes 3', () => {
    const data = Uint8Array.of(0b0000_0000, 0b0000_0001, 0x0, 0x0);
    const r = new BitReader(data);
    expect(r.read32(9)).toBe(0b1_0000_0000);
  });

  it('should read across bytes 4', () => {
    const data = Uint8Array.of(0x0, 0x0, 0x0, 0b0000_0000, 0b0000_0001);
    const r = new BitReader(data);
    r.skip(24);
    expect(r.read32(9)).toBe(0b1_0000_0000);
  });

  it('should cross multiple dwords if needed', () => {
    const data = Uint8Array.of(
      0b0001_0000,
      0x00,
      0x00,
      0b0000_1000,
      0x00,
      0x00,
    );
    const r = new BitReader(data);
    r.skip(4);
    expect(r.read32(32)).toBe(0x80_00_01);
  });
});
