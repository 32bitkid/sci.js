import { createBitReader } from '@4bitlabs/readers';
import { ReadonlyUint8Array } from './shared';

const EOF = 0x101;
const RESET = 0x100;

const INIT: unique symbol = Symbol('state:0');
const NEXT: unique symbol = Symbol('state:1');
const DONE: unique symbol = Symbol('state:4');
type State = typeof INIT | typeof NEXT | typeof DONE;

// Based on the implementation in SCI Decoder by Carl Muckenhoupt
export const unpack = (source: ReadonlyUint8Array): Uint8Array => {
  const outputs: number[] = [];

  let lastChar = 0;
  let lastBits = 0;

  let numBits = 9;
  let curToken = 0x102;
  let endToken = 0x1ff;
  let state: State = INIT;

  let stackPtr = 0;
  const stack = new Uint8Array(0x1014);
  const tokens = {
    data: new Uint8Array(0x1004),
    next: new Uint16Array(0x1004),
  } as const;

  const r = createBitReader(source, { mode: 'msb' });

  while (state !== DONE) {
    const next = r.read32(numBits);

    if (next === EOF) {
      state = DONE;
      continue;
    }

    if (state === INIT) {
      state = NEXT;
      lastBits = next;
      lastChar = next & 0xff;
      outputs.push(lastChar);
      continue;
    }

    if (next === RESET) {
      numBits = 9;
      curToken = 0x102;
      endToken = 0x1ff;
      state = INIT;
      continue;
    }

    let token = next;
    if (token >= curToken) {
      token = lastBits;
      stack[stackPtr++] = lastChar;
    }

    while (token > 0xff && token < 0x1004) {
      stack[stackPtr++] = tokens.data[token];
      token = tokens.next[token];
    }
    stack[stackPtr++] = token & 0xff;
    lastChar = token & 0xff;

    while (stackPtr > 0) {
      outputs.push(stack[--stackPtr]);
      // TODO if len == 0
    }

    if (curToken <= endToken) {
      tokens.data[curToken] = lastChar;
      tokens.next[curToken] = lastBits;
      curToken++;
      if (curToken === endToken && numBits < 12) {
        numBits++;
        endToken = (endToken << 1) + 1;
      }
    }
    lastBits = next;
  }

  return Uint8Array.from(outputs);
};
