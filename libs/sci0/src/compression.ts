import { decodeLzw, decodeHuffman } from '@4bitlabs/codecs';

type SupportedAlgorithms = 0 | 1 | 2;
const isSupported = (it: any): it is SupportedAlgorithms =>
  [0, 1, 2].includes(it);

const Algorithms: Record<0 | 1 | 2, (bytes: Uint8Array) => Uint8Array> = {
  0: (bytes) => bytes,
  1: (bytes) => decodeLzw(bytes, { literalWidth: 8, order: 'lsb' }),
  2: (bytes) => decodeHuffman(bytes),
};

export const decompress = (method: number, bytes: Uint8Array): Uint8Array => {
  if (!isSupported(method))
    throw new Error(`unsupported compression algorithm: ${method}`);
  return Algorithms[method](bytes);
};
