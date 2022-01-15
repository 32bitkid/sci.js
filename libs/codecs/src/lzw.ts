import { BitReader } from '@4bitlabs/readers';
import { Sequence, CodeMapping } from './shared';
import { concat } from './concat';

export const EOF_MARKER = Object.freeze(Uint8Array.of());
export const RESET_MARKER = Object.freeze(Uint8Array.of());

interface CommonLzwDecodeOptions {
  order?: 'msb' | 'lsb';
}

interface LiteralLzwDecodeOptions {
  literalWidth: number;
}

type InitialDictionary = (number | number[] | Uint8Array)[];

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
    dict.push([top, Uint8Array.of(top)]);
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
  const dict = seq.map<CodeMapping>((it, i) => {
    if (typeof it === 'number') return [i, Uint8Array.of(it)];
    if (Array.isArray(it)) return [i, Uint8Array.from(it)];
    return [i, it];
  });

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
  let previous: Sequence | null = null;

  const r = new BitReader(source, { mode: order });

  while (true) {
    if (1 << codeWidth <= nextCode) {
      if (codeWidth < MAX_CODE_LENGTH) {
        codeWidth += 1;
      } else {
        previous = null;
        nextCode = (1 << MAX_CODE_LENGTH) - 1;
      }
    }

    const next = r.read32(codeWidth);

    const match = seen.get(next);

    if (match === EOF_MARKER) break;

    if (match === RESET_MARKER) {
      seen = new Map(DICTIONARY);
      codeWidth = CODE_WIDTH;
      nextCode = TOP;
      previous = null;
      continue;
    }

    if (match) {
      outputs.push(match);
      if (previous) {
        const [char] = match;
        const nextEntry = Uint8Array.of(...previous, char);
        seen.set(nextCode, Uint8Array.from(nextEntry));
        nextCode += 1;
      }
      previous = match;
      continue;
    }

    if (next === nextCode && previous) {
      const [char] = previous;
      const nextEntry = Uint8Array.of(...previous, char);
      outputs.push(nextEntry);
      seen.set(nextCode, nextEntry);
      nextCode += 1;
      previous = nextEntry;
      continue;
    }

    throw new Error(`invalid lzw code: ${next}`);
  }

  return concat(outputs);
};
