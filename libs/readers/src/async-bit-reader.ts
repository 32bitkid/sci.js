export class AsyncBitReader {
  private readonly r: AsyncIterator<string | Uint8Array>;

  private bytes: Uint8Array = Uint8Array.of();
  private idx: number = 0;
  private bitsRemaining: number = 0;

  private bitBuffer: number = 0;

  constructor(r: AsyncIterable<string | Uint8Array>) {
    this.r = r[Symbol.asyncIterator]();
  }

  isByteAligned(): boolean {
    return (this.bitsRemaining & 0b111) === 0;
  }

  align(): this {
    this._trash(this.bitsRemaining & 0b111);
    return this;
  }

  async peek32(n: number): Promise<number> {
    if (n > 32 || n < 0) throw new Error('Out of range');
    if (n === 0) return 0;
    await this._fill(n);
    return this.bitBuffer >>> (32 - n);
  }

  async skip(n: number): Promise<void> {
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
          await this._nextChunk();
        }
      }
    }

    if (bitsToSkip > 0) {
      await this._fill(bitsToSkip);
      this._trash(bitsToSkip);
    }
  }

  async read32(n: number): Promise<number> {
    const result = await this.peek32(n);
    this._trash(n);
    return result;
  }

  private _trash(n: number): void {
    if (n < 0) throw new Error('Out of range');
    if (n > this.bitsRemaining) throw new Error('Out of range');
    if (n === 32) {
      this.bitBuffer = 0;
      this.bitsRemaining = 0;
    } else {
      this.bitBuffer <<= n;
      this.bitsRemaining -= n;
    }
  }

  private async _fill(n: number): Promise<void> {
    if (n <= this.bitsRemaining) return;

    const total = (32 - this.bitsRemaining) >>> 3;

    for (let i = 0; i < total; i++) {
      const pos = 32 - 8 - this.bitsRemaining;

      if (this.bytes.length <= this.idx) {
        if (this.bitsRemaining > n) return;
        await this._nextChunk();
      }

      this.bitBuffer |= this.bytes[this.idx] << pos;
      this.idx += 1;
      this.bitsRemaining += 8;
    }
  }

  private async _nextChunk(): Promise<void> {
    const result = await this.r.next();
    if (result.done) throw new Error('EOF');
    const chunk = result.value;
    this.bytes =
      typeof chunk !== 'string'
        ? chunk
        : Uint8Array.from([...chunk].map((x) => x.charCodeAt(0)));
    this.idx = 0;
  }
}
