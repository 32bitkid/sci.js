import { ResourceMap } from '../models/resource-map';

const HEAD_END_TOKEN = ~0 >>> 16;
const TAIL_END_TOKEN = ~0 >>> 0;

export function* consume(bytes: Uint8Array): IterableIterator<ResourceMap> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  for (let offset = 0; offset + 5 < bytes.length; offset += 6) {
    const head = view.getUint16(offset, true);
    const tail = view.getUint32(offset + 2, true);

    const isEnd = HEAD_END_TOKEN === head && TAIL_END_TOKEN === tail;
    if (isEnd) return;

    yield {
      id: head,
      file: tail >>> 26,
      offset: tail & 0b11_1111_1111_1111_1111_1111_1111,
    };
  }
}

export const parseAll = (bytes: Uint8Array): ResourceMap[] => [
  ...consume(bytes),
];
