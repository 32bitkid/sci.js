import { decode as decodeLzw } from '@4bitlabs/codecs/lzw';
import { decode as decodeHuffman } from '@4bitlabs/codecs/huffman';

type SupportedAlgorithms = 0 | 1 | 2;
const isSupported = (it: any): it is SupportedAlgorithms =>
  [0, 1, 2].includes(it);

const SCI0: Record<0 | 1 | 2, (bytes: Uint8Array) => Uint8Array> = {
  0: (bytes) => bytes,
  1: (bytes) => decodeLzw(bytes, { literalWidth: 8, order: 'lsb' }),
  2: (bytes) => decodeHuffman(bytes),
};

const SCI01: Record<0 | 1 | 2, (bytes: Uint8Array) => Uint8Array> = {
  0: (bytes) => bytes,
  1: (bytes) => decodeHuffman(bytes),
  2: () => {
    throw new Error('unsupported');
  },
};

export const decompress = (
  mode: 'sci0' | 'sci01',
  method: number,
  bytes: Uint8Array,
): Uint8Array => {
  switch (mode) {
    case 'sci0': {
      if (!isSupported(method))
        throw new Error(`unsupported compression algorithm: ${method}`);
      return SCI0[method](bytes);
    }
    case 'sci01': {
      if (!isSupported(method))
        throw new Error(`unsupported compression algorithm: ${method}`);
      return SCI01[method](bytes);
    }
    default:
      throw new Error(`unsupported compression mode: ${mode}`);
  }
};
