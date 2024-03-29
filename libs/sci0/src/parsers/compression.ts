import { decode as decodeHuffman } from '@4bitlabs/codecs/huffman';
import { decode as decodeLzw } from '@4bitlabs/codecs/lzw';

type Sci0Algorithms = 0 | 1 | 2;
type Sci01Algorithms = 0 | 1;
type DecompressFn = (bytes: Uint8Array) => Uint8Array;

const sci0Supported = (it: unknown): it is Sci0Algorithms =>
  typeof it === 'number' && Number.isInteger(it) && [0, 1, 2].includes(it);

const sci01Supported = (it: unknown): it is Sci01Algorithms =>
  typeof it === 'number' && Number.isInteger(it) && [0, 1].includes(it);

const SCI0: Record<Sci0Algorithms, DecompressFn> = {
  0: (bytes) => bytes,
  1: (bytes) => decodeLzw(bytes, { literalWidth: 8, order: 'lsb' }),
  2: (bytes) => decodeHuffman(bytes),
};

const SCI01: Record<Sci01Algorithms, DecompressFn> = {
  0: (bytes) => bytes,
  1: (bytes) => decodeHuffman(bytes),
};

export const decompress = (
  mode: 'sci0' | 'sci01',
  method: number,
  bytes: Uint8Array,
): Uint8Array => {
  switch (mode) {
    case 'sci0': {
      if (!sci0Supported(method))
        throw new Error(`unsupported compression algorithm: ${method}`);
      return SCI0[method](bytes);
    }
    case 'sci01': {
      if (!sci01Supported(method))
        throw new Error(`unsupported compression algorithm: ${method}`);
      return SCI01[method](bytes);
    }
    default:
      throw new Error(`unsupported compression mode: ${mode}`);
  }
};
