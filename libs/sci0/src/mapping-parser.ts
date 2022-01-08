import through from 'through2';

export interface ResourceMap {
  id: number;
  file: number;
  offset: number;
}

const bufferize = (chunk: any, encoding: BufferEncoding): Uint8Array => {
  if (chunk instanceof Uint8Array) return chunk;
  if (typeof chunk === 'string') return new Buffer(chunk, encoding);
  throw new Error('unsupported chunk type');
};

const join = (...arrs: Uint8Array[]): Uint8Array => {
  const size = arrs.reduce((s, it) => s + it.byteLength, 0);
  const result = new Uint8Array(size);
  arrs.reduce((pos, arr) => {
    result.set(arr, pos);
    return pos + arr.byteLength;
  }, 0);
  return result;
};

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

const consume = (
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

export const parseAllMappings = (
  bytes: Uint8Array,
): [ResourceMap[], boolean] => {
  const result: ResourceMap[] = [];
  const ended = consume(bytes, (rm) => result.push(rm));
  return [result, ended === true];
};

export const mappingParser = () => {
  let remaining = Uint8Array.of();
  return through(
    {
      readableObjectMode: true,
      writableObjectMode: false,
    },
    function (chunk, encoding, callback) {
      const next = bufferize(chunk, encoding);
      const bytes = remaining.length ? join(remaining, next) : next;

      const ended = consume(bytes, (e) => this.push(e));
      if (ended !== true) {
        remaining = ended;
        callback();
      } else {
        callback(null, null);
      }
    },
  );
};
