import { unpack as unpackHuffman } from '@4bitlabs/codecs/huffman';
import { unpack as unpackLzw } from '@4bitlabs/codecs/lzw';
import { unpack as unpackComp3 } from '@4bitlabs/codecs/comp3';

import { exhaustive } from '../utils/exhaustive';

type Sci0Algorithms = 0 | 1 | 2;
type Sci01Algorithms = 0 | 1 | 2;
type DecompressFn = (bytes: Uint8Array) => Uint8Array;

const sci0Supported = (it: unknown): it is Sci0Algorithms =>
  typeof it === 'number' && Number.isInteger(it) && [0, 1, 2].includes(it);

const sci01Supported = (it: unknown): it is Sci01Algorithms =>
  typeof it === 'number' && Number.isInteger(it) && [0, 1, 2].includes(it);

const SCI0: Record<Sci0Algorithms, DecompressFn> = {
  0: (bytes) => bytes,
  1: (bytes) => unpackLzw(bytes, { literalWidth: 8, order: 'lsb' }),
  2: (bytes) => unpackHuffman(bytes),
};

const SCI01: Record<Sci01Algorithms, DecompressFn> = {
  0: (bytes) => bytes,
  1: (bytes) => unpackHuffman(bytes),
  2: (bytes) => unpackComp3(bytes),
};

/**
 * Decompress resource payload bytes with a specific algorithm.
 *
 * #### SCI0 algorithm
 * |  |  |
 * | --- | --- |
 * | 0 | _no compression_ |
 * | 1 | LZW (8-bit/lsb) |
 * | 2 | Huffman |
 *
 * #### SCI01 algorithm
 * |  |  |
 * | --- | --- |
 * | 0 | _no compression_ |
 * | 1 | Huffman |
 * | 2 | COMP3 |
 *
 * @see {@link ResourceHeader.compression}
 *
 * @param engine Select between engine type: `sci0` or `sci01`.
 * @param algorithm The decompression method.
 * @param bytes The compressed bytes to decompress.
 * @returns Decompressed payload data.
 */
export const decompress = (
  engine: 'sci0' | 'sci01',
  algorithm: number,
  bytes: Uint8Array,
): Uint8Array => {
  switch (engine) {
    case 'sci0': {
      if (!sci0Supported(algorithm))
        throw new Error(
          `unsupported compression algorithm: ${algorithm.toString(10)}`,
        );
      return SCI0[algorithm](bytes);
    }
    case 'sci01': {
      if (!sci01Supported(algorithm))
        throw new Error(
          `unsupported compression algorithm: ${algorithm.toString(10)}`,
        );
      return SCI01[algorithm](bytes);
    }
    default:
      exhaustive('unsupported engine/compression', engine);
  }
};
