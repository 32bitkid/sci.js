export default class BitReader {
  private readonly view: DataView;

  private idx: number;
  private buffer: number;
  private remaining: number;

  constructor(buffer: ArrayBufferLike) {
    this.view = new DataView(buffer);
    this.idx = 0;
    this.buffer = 0;
    this.remaining = 0;
  }

  isByteAligned(): boolean {
    return (this.remaining & 0b111) === 0;
  }

  align(): BitReader {
    this.trash(this.remaining & 0b111);
    return this;
  }

  seek(offset: number): BitReader {
    this.idx = offset;
    this.buffer = 0;
    this.remaining = 0;
    return this;
  }

  read32(n: number): number {
    const result = this.peek32(n);
    this.skip(n);
    return result;
  }

  peek32(n: number): number {
    if (n > 32 || n < 0) throw new Error('Out of range');
    this.tryFill(n);
    return this.buffer >>> (32 - n);
  }

  skip(n: number): BitReader {
    if (n < 0) throw new Error('Out of range');

    let bitsToSkip = n;
    if (bitsToSkip > this.remaining) {
      bitsToSkip -= this.remaining;

      this.buffer = 0;
      this.remaining = 0;
      this.idx += bitsToSkip >>> 3;

      bitsToSkip &= 0b111;
    }

    if (bitsToSkip > 0) {
      this.tryFill(bitsToSkip);
      this.trash(bitsToSkip);
    }
    return this;
  }

  private trash(n: number): BitReader {
    this.buffer <<= n;
    this.remaining -= n;
    return this;
  }

  private tryFill(n: number): BitReader {
    if (n > this.remaining) this.fill(n - this.remaining);
    return this;
  }

  private fill(n: number): BitReader {
    let total = Math.ceil((32 - this.remaining) / 8);

    if (this.idx + total > this.view.byteLength) {
      total = this.view.byteLength - this.idx;
    }

    if (total << 3 < n) throw new Error('Buffer underflow!');

    for (let i = 0; i < total; i++) {
      const pos = 32 - 8 - (i << 3) - this.remaining;
      this.buffer |= this.view.getUint8(this.idx + i) << pos;
    }

    this.idx += total;
    this.remaining += total << 3;

    return this;
  }
}
