import { BitReader } from '@32bitkid/readers';

interface LzwDecodeOptions {
  literalWidth?: number;
  order?: 'msb' | 'lsb';
}

const concat = (parts: number[][]): Uint8Array => {
  const len = parts.reduce((sum, it) => sum + it.length, 0);
  const result = new Uint8Array(len);
  parts.reduce((sum, it) => {
    result.set(it, sum);
    return sum + it.length;
  }, 0);
  return result;
};

const MAX_CODE_LENGTH = 12;

export const decode = (
  source: Uint8Array,
  opts: LzwDecodeOptions = {},
): Uint8Array => {
  const outputs: number[][] = [];
  const { literalWidth = 8, order = 'lsb' } = opts;

  const RESET_CODE = 1 << literalWidth;
  const EOF_CODE = RESET_CODE + 1;

  const DEFAULT_DICT = Array(1 << literalWidth)
    .fill(null)
    .map<[number, number[]]>((_, i) => [i, [i]]);

  let seen: Map<number, number[]> = new Map(DEFAULT_DICT);
  let codeWidth = literalWidth + 1;
  let nextCode = EOF_CODE + 1;
  let previous: number[] | null = null;

  const r = new BitReader(source, { mode: order });

  while (true) {
    const next = r.read32(codeWidth);

    const isReset = next === RESET_CODE;
    if (isReset) {
      seen = new Map(DEFAULT_DICT);
      codeWidth = literalWidth + 1;
      nextCode = EOF_CODE + 1;
      previous = null;
      continue;
    }

    const isEOF = next === EOF_CODE;
    if (isEOF) break;

    const match = seen.get(next);
    if (match) {
      outputs.push(match);
      if (previous) {
        const [char] = match;
        const nextEntry: number[] = [...previous, char];
        seen.set(nextCode, nextEntry);
        nextCode += 1;
      }
      previous = [...match];
    } else if (next === nextCode && previous) {
      const [char] = previous;
      const nextEntry: number[] = [...previous, char];
      outputs.push(nextEntry);
      seen.set(nextCode, nextEntry);
      nextCode += 1;
      previous = [...nextEntry];
    } else {
      throw new Error(`invalid lzw code: ${next}`);
    }

    if (1 << codeWidth <= nextCode) {
      if (codeWidth < MAX_CODE_LENGTH) {
        codeWidth += 1;
      } else {
        previous = null;
        nextCode = (1 << MAX_CODE_LENGTH) - 1;
      }
    }
  }

  return concat(outputs);
};
