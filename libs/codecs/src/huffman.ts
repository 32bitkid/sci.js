import { BitReader } from '@4bitlabs/readers';

type Node = [value: number, siblings: number];

const nextCode = (
  br: BitReader,
  nodes: Map<number, Node>,
  idx: number,
): [number, boolean] => {
  const [value, siblings] = nodes.get(idx)!;

  if (siblings === 0) return [value, false];

  const next = br.read32(1) ? siblings & 0x0f : (siblings & 0xf0) >> 4;

  return next === 0 ? [br.read32(8), true] : nextCode(br, nodes, idx + next);
};

export const decode = (bytes: Uint8Array): Uint8Array => {
  const br = new BitReader(bytes);
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
  }, new Uint8Array(result.length));
};
