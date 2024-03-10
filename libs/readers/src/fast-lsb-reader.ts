import { BitReader } from './bit-reader';
import { ReadonlyDataView } from './readonly-data-view';
import { TypedArray } from './typed-array';
import { copyBuffer } from './utils/copy-buffer';

const ALL_ONES = ~0 >>> 0;

export class FastLsbReader implements BitReader {
  private readonly view: ReadonlyDataView;
  private readonly byteLength: number;
  private bitOffset: number = 0;

  // Note: In certain cases this *can* be faster, but its also needs
  // to copy the source array buffer to avoid buffer overruns, making
  // it less memory efficient. Generally, the normal LsbReader is
  // negligibly slower and doesn't incur the memory/copy penalty.
  constructor(source: TypedArray | ArrayBuffer) {
    this.byteLength = source.byteLength;
    const buffer = new ArrayBuffer(this.byteLength + 5);
    copyBuffer(source, buffer);
    this.view = new DataView(buffer);
  }

  isByteAligned(): boolean {
    return (this.bitOffset & 0b111) === 0;
  }

  align(): FastLsbReader {
    this.bitOffset += (8 - this.bitOffset) & 0b111;
    return this;
  }

  seek(offset: number): FastLsbReader {
    this.bitOffset = offset << 3;
    return this;
  }

  read32(n: number): number {
    const result = this.peek32(n);
    this.bitOffset += n;
    return result;
  }

  peek32(n: number): number {
    if (n === 0) return 0;

    const idx = this.bitOffset >>> 3;
    const shift = this.bitOffset & 0b111;

    if ((this.bitOffset + n) / 8 > this.byteLength)
      throw new Error('out of bytes');

    if (shift + n <= 32) {
      const mask = ALL_ONES >>> (32 - n);
      const bytes = this.view.getUint32(idx, true);
      return (bytes >>> shift) & mask;
    }

    const tailBits = 32 - shift;
    const tailMask = ALL_ONES >>> (tailBits + shift);
    const tail = (this.view.getUint32(idx, true) >> shift) & tailMask;

    const headBits = n - tailBits;
    const headMask = ALL_ONES >>> headBits;
    const head = this.view.getUint8(idx + 4) & headMask;

    return (head << tailBits) | tail;
  }

  skip(n: number): FastLsbReader {
    this.bitOffset += n;
    return this;
  }
}
