export type BitReaderMode = 'msb' | 'lsb';

interface Source {
  readonly buffer: ArrayBufferLike;
  readonly byteLength: number;
  readonly byteOffset: number;
}

export type ReadonlyDataView = Omit<DataView, `set${string}`>;

export interface BitReaderOptions {
  mode?: BitReaderMode;
}

export class BitReader {
  private readonly view: ReadonlyDataView;

  private idx: number;
  private remainder: number;
  private bitsRemaining: number;

  private readonly _next: (n: number) => number;
  private readonly _trash: (n: number) => void;
  private readonly _fill: (n: number) => void;
  private readonly _peek: (n: number) => number;

  readonly mode: BitReaderMode;

  constructor(bytes: Source, opts: BitReaderOptions = {}) {
    const { mode = 'msb' } = opts;

    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    this.idx = 0;
    this.remainder = 0;
    this.bitsRemaining = 0;
    this.mode = mode;

    this._next = mode === 'msb' ? this._msbNext : this._lsbNext;
    this._trash = mode === 'msb' ? this._msbTrash : this._lsbTrash;
    this._fill = mode === 'msb' ? this._msbFill : this._lsbFill;
    this._peek = mode === 'msb' ? this._msbPeek : this._lsbPeek;
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
    this.remainder = 0;
    this.bitsRemaining = 0;
    return this;
  }

  read32(n: number): number {
    if (n > 32) throw new Error(`out of range: ${n} > 32`);
    const result = this.peek32(n);
    this.skip(n);
    return result;
  }

  peek32(n: number): number {
    if (n > 32) throw new Error(`out of range: ${n} > 32`);
    if (this.bitsRemaining >= n) {
      return this._next(n);
    }

    let bitsLeft = n - this.bitsRemaining;
    const head = this.bitsRemaining > 0 ? this._next(this.bitsRemaining) : 0;
    const tail = this._peek(bitsLeft);
    return (head << bitsLeft) | tail;
  }

  skip(n: number): BitReader {
    if (n < 0) throw new Error('Out of range');

    let bitsToSkip = n;
    if (bitsToSkip > this.bitsRemaining) {
      // all cached bits
      bitsToSkip -= this.bitsRemaining;

      this.remainder = 0;
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

  private get bytesLeft() {
    return this.view.byteLength - (this.view.byteOffset + this.idx);
  }

  /* Most-significant bit first */

  private _msbNext = (n: number): number => this.remainder >>> (32 - n);

  private _msbTrash(n: number): void {
    this.remainder <<= n;
    this.bitsRemaining -= n;
  }

  private _msbFill(n: number): void {
    if (n > 32) throw new Error('unsupported');
    if (n <= this.bitsRemaining) return;

    if (this.bitsRemaining === 0 && this.bytesLeft >= 4) {
      // fast: get the next 32-bits
      this.remainder = this.view.getUint32(this.idx);
      this.bitsRemaining = 32;
      this.idx += 4;
      return;
    }

    while (this.bitsRemaining <= 24 && this.bytesLeft > 0) {
      // slow: fill byte-by-byte
      const byte = this.view.getUint8(this.idx);
      this.idx++;
      this.remainder |= byte << (32 - 8 - this.bitsRemaining);
      this.bitsRemaining += 8;
    }

    if (n > this.bitsRemaining) {
      throw new Error('out of bytes');
    }
  }

  private _msbPeek(n: number): number {
    if (n > 32) throw new Error('unsupported');
    if (this.bytesLeft >= 4) {
      return this.view.getUint32(this.idx) >>> (32 - n);
    }

    let value = 0;
    for (let i = 0; i < 4 && this.bytesLeft - i > 0; i++) {
      value |= this.view.getUint8(this.idx + i) << (32 - (i + 1) * 8);
    }
    return value >>> (32 - n);
  }

  /* Least-significant bit first */
  private _lsbNext = (n: number): number => this.remainder & (~0 >>> (32 - n));

  private _lsbTrash(n: number): void {
    this.remainder >>>= n;
    this.bitsRemaining -= n;
  }

  private _lsbFill(n: number): void {
    if (n > 32) throw new Error('unsupported');
    if (n <= this.bitsRemaining) return;

    if (this.bitsRemaining === 0 && this.bytesLeft >= 4) {
      // fast: get the next 32-bits
      this.remainder = this.view.getUint32(this.idx, true);
      this.bitsRemaining = 32;
      this.idx += 4;
      return;
    }

    while (this.bitsRemaining <= 24 && this.bytesLeft > 0) {
      // slow: fill byte-by-byte
      const byte = this.view.getUint8(this.idx);
      this.idx++;
      this.remainder |= byte << this.bitsRemaining;
      this.bitsRemaining += 8;
    }

    if (n > this.bitsRemaining) {
      throw new Error('out of bytes');
    }
  }

  private _lsbPeek(n: number): number {
    if (n > 32) throw new Error('unsupported');
    if (this.bytesLeft >= 4) {
      return this.view.getUint32(this.idx, true) & (~0 >>> (32 - n));
    }

    let value = 0;
    for (let i = 0; i < 4 && this.bytesLeft - i > 0; i++) {
      value |= this.view.getUint8(this.idx + i) << this.bitsRemaining;
    }
    return value & (~0 >>> (32 - n));
  }
}
