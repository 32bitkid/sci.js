type BitReaderMode = 'msb' | 'lsb';

interface BitReaderOptions {
  mode?: BitReaderMode;
}

export class BitReader {
  private readonly view: DataView;

  private idx: number;
  private bitBuffer: number;
  private bitsRemaining: number;

  private readonly _fillPos: (n: number) => number;
  private readonly _peek: (n: number) => number;
  private readonly _trash: (n: number) => void;

  readonly mode: BitReaderMode;

  constructor(bytes: Uint8Array, opts: BitReaderOptions = {}) {
    const { mode = 'msb' } = opts;

    const begin = bytes.byteOffset;
    const end = begin + bytes.byteLength;

    this.view = new DataView(bytes.buffer.slice(begin, end));
    this.idx = 0;
    this.bitBuffer = 0;
    this.bitsRemaining = 0;
    this.mode = mode;

    this._fillPos = mode === 'msb' ? this._msbFillPos : this._lsbFillPos;
    this._peek = mode === 'msb' ? this._msbPeek : this._lsbPeek;
    this._trash = mode === 'msb' ? this._msbTrash : this._lsbTrash;
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
    return this._peek(n);
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

  private _fill(n: number): void {
    if (n <= this.bitsRemaining) return;

    let total = Math.floor((32 - this.bitsRemaining) / 8);

    if (this.idx + total > this.view.byteLength) {
      total = this.view.byteLength - this.idx;
    }

    if (total << 3 < n - this.bitsRemaining)
      throw new Error('Buffer underflow!');

    for (let i = 0; i < total; i++) {
      this.bitBuffer |= this.view.getUint8(this.idx + i) << this._fillPos(i);
    }

    this.idx += total;
    this.bitsRemaining += total << 3;
  }

  /* Most-significant bit first */
  private _msbPeek = (n: number): number => this.bitBuffer >>> (32 - n);

  private _msbTrash(n: number): void {
    this.bitBuffer <<= n;
    this.bitsRemaining -= n;
  }

  private _msbFillPos = (i: number): number =>
    24 - (i << 3) - this.bitsRemaining;

  /* Least-significant bit first */
  private _lsbPeek = (n: number): number => this.bitBuffer & (~0 >>> (32 - n));

  private _lsbTrash(n: number): void {
    this.bitBuffer >>>= n;
    this.bitsRemaining -= n;
  }

  private _lsbFillPos = (i: number): number => (i << 3) + this.bitsRemaining;
}
