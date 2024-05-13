import { BitReader } from './bit-reader';
import { ReadonlyDataView } from './readonly-data-view';
import { TypedArray } from './typed-array';

export class MsbReader implements BitReader {
  private readonly view: ReadonlyDataView;
  private idx: number = 0;
  private buffer: number = 0;
  private bitsRemaining: number = 0;

  constructor(source: TypedArray | ArrayBuffer) {
    this.view =
      source instanceof ArrayBuffer
        ? new DataView(source)
        : new DataView(source.buffer, source.byteOffset, source.byteLength);
  }

  isByteAligned(): boolean {
    return (this.bitsRemaining & 0b111) === 0;
  }

  align(): this {
    const trashBits = this.bitsRemaining & 0b111;
    this.buffer <<= trashBits;
    this.bitsRemaining -= trashBits;
    return this;
  }

  seek(offset: number): this {
    this.idx = offset;
    this.buffer = 0;
    this.bitsRemaining = 0;
    return this;
  }

  read32(n: number): number {
    if (n === 0) return 0;
    if (n > 32 || n < 0)
      throw new Error(`out of range: ${n} must be between 0 and 32`);

    if (n > this.bitsRemaining) {
      const bitsLeft = n - this.bitsRemaining;

      // exhaust buffer
      const head = this.buffer >>> (32 - this.bitsRemaining);
      this.buffer = 0;
      this.bitsRemaining = 0;

      // refill the buffer
      this.fill(bitsLeft);

      // extract remaining bits from buffer
      const tail = this.buffer >>> (32 - bitsLeft);
      this.buffer <<= bitsLeft;
      this.bitsRemaining -= bitsLeft;

      return (head << bitsLeft) | tail;
    }

    const result = this.buffer >>> (32 - n);
    this.buffer <<= n;
    this.bitsRemaining -= n;
    return result;
  }

  peek32(n: number): number {
    if (n === 0) return 0;
    if (n > 32 || n < 0)
      throw new Error(`out of range: ${n} must be between 0 and 32`);

    this.fill(n);
    return this.buffer >>> (32 - n);
  }

  skip(n: number): this {
    if (n < 0) throw new Error('out of range: n < 0');

    if (n == 0) return this;

    let bitsToSkip = n;
    if (bitsToSkip > this.bitsRemaining) {
      // all cached bits
      bitsToSkip -= this.bitsRemaining;

      this.buffer = 0;
      this.bitsRemaining = 0;
      this.idx += bitsToSkip >>> 3;

      bitsToSkip &= 0b111;
    }

    if (bitsToSkip > 0) {
      this.fill(bitsToSkip);
      this.buffer <<= bitsToSkip;
      this.bitsRemaining -= bitsToSkip;
    }

    return this;
  }

  private get bytesLeftToRead() {
    return this.view.byteLength - this.idx;
  }

  private fill(n: number): void {
    if (n > 32) throw new Error('unsupported');
    if (n <= this.bitsRemaining) return;

    if (this.bitsRemaining === 0 && this.bytesLeftToRead >= 4) {
      // fast: get the next 32-bits
      this.buffer = this.view.getUint32(this.idx);
      this.bitsRemaining = 32;
      this.idx += 4;
      return;
    }

    while (this.bitsRemaining <= 24 && this.bytesLeftToRead > 0) {
      // slow: fill byte-by-byte
      const byte = this.view.getUint8(this.idx);
      this.idx++;
      this.buffer |= byte << (32 - 8 - this.bitsRemaining);
      this.bitsRemaining += 8;
    }

    if (n > this.bitsRemaining) {
      throw new Error('out of bytes');
    }
  }
}
