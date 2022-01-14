import { BitReader } from '@32bitkid/readers';
import { Sequence, CodeMapping } from './shared';
import { concat } from './concat';

export const EOF_MARKER = Object.freeze([] as const);
export const RESET_MARKER = Object.freeze([] as const);

interface CommonLzwDecodeOptions {
  order?: 'msb' | 'lsb';
}

interface LiteralLzwDecodeOptions {
  literalWidth: number;
}

type InitialDictionary = (typeof EOF_MARKER | typeof RESET_MARKER | number)[];

interface CustomLzwDecodeOptions {
  dictionary: InitialDictionary;
}

type LzwDecodeOptions =
  | CommonLzwDecodeOptions
  | (CommonLzwDecodeOptions & LiteralLzwDecodeOptions)
  | (CommonLzwDecodeOptions & CustomLzwDecodeOptions);

const MAX_CODE_LENGTH = 12;

interface LzwInit {
  readonly DICTIONARY: Readonly<CodeMapping[]>;
  readonly TOP: number;
  readonly CODE_WIDTH: number;
}

const initFromLiteralWidth = (literalWidth: number): LzwInit => {
  const dict: CodeMapping[] = [];
  let top: number;
  for (top = 0; top < 1 << literalWidth; top++) {
    dict.push([top, [top]]);
  }
  dict.push([top++, RESET_MARKER]);
  dict.push([top++, EOF_MARKER]);

  return {
    DICTIONARY: dict,
    TOP: top,
    CODE_WIDTH: Math.ceil(Math.log2(top)),
  };
};

const initFromDict = (seq: InitialDictionary): LzwInit => {
  if (!seq.some((it) => it === EOF_MARKER))
    throw new Error('initial dictionary does not contain EOF_MARKER');
  const top = seq.length;
  const dict = seq.map<CodeMapping>((it, i) => [
    i,
    typeof it === 'number' ? [it] : it,
  ]);

  return {
    DICTIONARY: dict,
    TOP: top,
    CODE_WIDTH: Math.ceil(Math.log2(top)),
  };
};

const init = (
  opts: LiteralLzwDecodeOptions | CustomLzwDecodeOptions | Record<never, never>,
): LzwInit => {
  if ('literalWidth' in opts) return initFromLiteralWidth(opts.literalWidth);
  if ('dictionary' in opts) return initFromDict(opts.dictionary);

  return initFromLiteralWidth(8);
};

export const decode = (
  source: Uint8Array,
  opts: LzwDecodeOptions,
): Uint8Array => {
  const outputs: Sequence[] = [];
  const { order = 'lsb' } = opts;

  const { DICTIONARY, TOP, CODE_WIDTH } = init(opts);

  let seen = new Map(DICTIONARY);
  let codeWidth = CODE_WIDTH;
  let nextCode = TOP;
  let previous: number[] | null = null;

  const r = new BitReader(source, { mode: order });

  while (true) {
    const next = r.read32(codeWidth);

    const match = seen.get(next);

    const isReset = match === RESET_MARKER;
    if (isReset) {
      seen = new Map(DICTIONARY);
      codeWidth = CODE_WIDTH;
      nextCode = TOP;
      previous = null;
      continue;
    }

    const isEOF = match === EOF_MARKER;
    if (isEOF) break;

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
