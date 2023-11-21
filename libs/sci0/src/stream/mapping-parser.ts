import through from 'through2';

import { consume } from '../parsers/mapping';

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
