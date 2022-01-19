export interface ResourceMap {
  id: number;
  file: number;
  offset: number;
}

type Entry = [number, number];

const EMPTY = Uint8Array.of(0);
const HEAD_END_TOKEN = ~0 >>> 16;
const TAIL_END_TOKEN = ~0 >>> 0;

const read = (view: DataView, offset: number): Entry => {
  const head = view.getUint16(offset, true);
  const tail = view.getUint32(offset + 2, true);
  return [head, tail];
};

const parse = ([head, tail]: Entry): ResourceMap => ({
  id: head,
  file: tail >>> 26,
  offset: tail & 0b11_1111_1111_1111_1111_1111_1111,
});

const isEnd = ([head, tail]: Entry) =>
  HEAD_END_TOKEN === head && TAIL_END_TOKEN === tail;

export const consume = (
  bytes: Uint8Array,
  callback: (e: ResourceMap) => void,
): true | Uint8Array => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  let i: number;
  for (i = 0; i + 5 < bytes.length; i += 6) {
    const token = read(view, i);
    if (isEnd(token)) return true;
    callback(parse(token));
  }
  return i % 6 !== 0 ? bytes.slice(i) : EMPTY;
};

export const parseAll = (bytes: Uint8Array): [ResourceMap[], boolean] => {
  const result: ResourceMap[] = [];
  const ended = consume(bytes, (rm) => result.push(rm));
  return [result, ended === true];
};
