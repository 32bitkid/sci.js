interface ReadableStreamLike {
  read(size?: number): string | Buffer;
}

export class BitReader {
  private readonly r: ReadableStreamLike;

  private bytes: Uint8Array = Uint8Array.of();
  private idx: number = 0;
  private bitsRemaining: number = 0;

  private bitBuffer: number = 0;

  constructor(r: ReadableStreamLike) {
    this.r = r;
  }

  isByteAligned(): boolean {
    return (this.bitsRemaining & 0b111) === 0;
  }

  align(): BitReader {
    this._trash(this.bitsRemaining & 0b111);
    return this;
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

      let bytesToSkip = bitsToSkip >>> 3;
      bitsToSkip &= 0b111;

      while (bytesToSkip > 0) {
        if (bytesToSkip < this.bytes.length - this.idx) {
          this.idx += bytesToSkip;
          bytesToSkip = 0;
        } else {
          bytesToSkip -= this.bytes.length - this.idx;
          this._nextChunk();
        }
      }
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

    let total = (32 - this.bitsRemaining) >>> 3;

    for (let i = 0; i < total; i++) {
      const pos = 32 - 8 - this.bitsRemaining;

      if (this.bytes.length <= this.idx) {
        if (this.bitsRemaining > n) return this;
        this._nextChunk();
      }

      this.bitBuffer |= this.bytes[this.idx] << pos;
      this.idx += 1;
      this.bitsRemaining += 8;
    }

    return this;
  }

  private _nextChunk(): BitReader {
    const chunk = this.r.read();
    if (chunk === null) throw new Error('EOF');
    if (chunk.length === 0) throw new Error('EOF');
    this.bytes = new Uint8Array(
      typeof chunk === 'string'
        ? new Buffer(chunk, 'binary').buffer
        : chunk.buffer,
    );
    this.idx = 0;
    return this;
  }
}
