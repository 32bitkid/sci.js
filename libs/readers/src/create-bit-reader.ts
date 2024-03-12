import { BitReader } from './bit-reader';
import { BitReaderOptions } from './bit-reader-options';
import { FastLsbReader } from './fast-lsb-reader';
import { FastMsbReader } from './fast-msb-reader';
import { LsbReader } from './lsb-reader';
import { MsbReader } from './msb-reader';
import { TypedArray } from './typed-array';

const safeReaders = { msb: MsbReader, lsb: LsbReader } as const;
const fastReaders = { msb: FastMsbReader, lsb: FastLsbReader } as const;

export function createBitReader(
  source: TypedArray | ArrayBuffer,
  options: BitReaderOptions = {},
): BitReader {
  const { fast = false, mode = 'msb' } = options;
  const BitReader = (fast ? fastReaders : safeReaders)[mode];
  return new BitReader(source);
}
