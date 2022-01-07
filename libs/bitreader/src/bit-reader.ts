export class BitReader {
  private readonly view: DataView;

  private idx: number;
  private bitBuffer: number;
  private bitsRemaining: number;

  constructor(buffer: ArrayBufferLike) {
    this.view = new DataView(buffer);
    this.idx = 0;
    this.bitBuffer = 0;
    this.bitsRemaining = 0;
  }

  isByteAligned(): boolean {
    return (this.bitsRemaining & 0b111) === 0;
  }

  align(): BitReader {
    this._trash(this.bitsRemaining & 0b111);
    return this;
  }

  seek(offset: number): BitReader {
    this.idx = offset;
    this.bitBuffer = 0;
    this.bitsRemaining = 0;
    return this;
  }

  read32(n: number): number {
    const result = this.peek32(n);
    this.skip(n);
    return result;
  }

  peek32(n: number): number {
    if (n > 32 || n < 0) throw new Error('Out of range');
    if (n === 0) return 0;
    this._fill(n);
    return this.bitBuffer >>> (32 - n);
  }

  skip(n: number): BitReader {
    if (n < 0) throw new Error('Out of range');

    let bitsToSkip = n;
    if (bitsToSkip > this.bitsRemaining) {
      bitsToSkip -= this.bitsRemaining;

      this.bitBuffer = 0;
      this.bitsRemaining = 0;
      this.idx += bitsToSkip >>> 3;

      bitsToSkip &= 0b111;
    }

    if (bitsToSkip > 0) {
      this._fill(bitsToSkip);
      this._trash(bitsToSkip);
    }
    return this;
  }

  private _trash(n: number): BitReader {
    this.bitBuffer <<= n;
    this.bitsRemaining -= n;
    return this;
  }

  private _fill(n: number): BitReader {
    if (n <= this.bitsRemaining) return this;

    let total = Math.floor((32 - this.bitsRemaining) / 8);

    if (this.idx + total > this.view.byteLength) {
      total = this.view.byteLength - this.idx;
    }

    if (total << 3 < n) throw new Error('Buffer underflow!');

    for (let i = 0; i < total; i++) {
      const pos = 32 - 8 - (i << 3) - this.bitsRemaining;
      this.bitBuffer |= this.view.getUint8(this.idx + i) << pos;
    }

    this.idx += total;
    this.bitsRemaining += total << 3;

    return this;
  }
}
