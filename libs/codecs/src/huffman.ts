import { createBitReader, type BitReader } from '@4bitlabs/readers';

type Node = [value: number, siblings: number];

const nextCode = (
  br: BitReader,
  nodes: Map<number, Node>,
  idx: number,
): [number, boolean] => {
  const node = nodes.get(idx);
  if (!node)
    throw new Error(
      `unpack error: unexpected huffman code [${idx.toString(16)}]`,
    );

  const [value, siblings] = node;
  if (siblings === 0) return [value, false];

  const next = br.read32(1) ? siblings & 0x0f : (siblings & 0xf0) >> 4;

  return next === 0 ? [br.read32(8), true] : nextCode(br, nodes, idx + next);
};

/**
 * [Huffman][huffman] decompression algorithm used in [Sierra On-line][sierra] [SCI-engine][sci0] games.
 *
 * [huffman]: https://en.wikipedia.org/wiki/Huffman_coding
 * [sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
 * [sci0]: http://sciwiki.sierrahelp.com/index.php/Sierra_Creative_Interpreter
 *
 * @param source The compressed bytes.
 * @returns Decompressed payload.
 *
 * @example
 *
 * ```ts
 * import { Huffman } from '@4bitlabs/codecs';
 *
 * const encodedBytes = Uint8Array.of(\/* encoded data *\/);
 * const bytes = Huffman.unpack(encodedBytes);
 * ```
 */
export const unpack = (source: Uint8Array | Uint8ClampedArray): Uint8Array => {
  const br = createBitReader(source);
  const nodeCount = br.read32(8);
  const terminal = br.read32(8);

  const nodes = new Map<number, Node>();
  for (let i = 0; i < nodeCount; i++)
    nodes.set(i, [br.read32(8), br.read32(8)]);

  const result: number[] = [];

  while (true) {
    const [c, ok] = nextCode(br, nodes, 0);
    if (ok && c === terminal) break;
    result.push(c);
  }

  return result.reduce((buffer, i, idx) => {
    buffer[idx] = i;
    return buffer;
  }, new Uint8Array(result.length)); // TODO replace with Uint8Array.from
};
