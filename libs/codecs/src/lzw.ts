import { createBitReader } from '@4bitlabs/readers';
import { concat } from './concat';

/**
 * The EOF/STOP marker. When encountered, stops processing the input stream and return the uncompressed data.
 */
export const EOF_MARKER: unique symbol = Symbol('EOF_MARKER');
/**
 * The RESET marker. When encountered, resets the dictionary back to its initial state.
 */
export const RESET_MARKER: unique symbol = Symbol('RESET_ MARKER');

export type CodeMapping = [
  number,
  Uint8Array | Uint8ClampedArray | typeof EOF_MARKER | typeof RESET_MARKER,
];

/**
 * Basic options for LZW decoding.
 *
 * @example Changing the bit packing ordering.
 *
 * By default, least-significant bit ordering is used. You can change the encoded byte ordering of the decoder with the `options` parameter. To use least-significant bit
 * ordering:
 *
 * ```ts
 * const bytes = Lzw.unpack(encodedBytes, { order: 'msb' });
 * ```
 *
 * @example Using a different code-width for decoding
 *
 * The default _code-width_ it uses is `8`, this can also be adjusted. To use an ASCII 7-bit code width:
 *
 * ```ts
 * const bytes = Lzw.unpack(encodedBytes, { literalWidth: 7 });
 * ```
 *
 */
export interface SimpleLzwDecodeOptions {
  /**
   * Select the packing bit-ordering.
   * @default 'lsb'
   */
  order?: 'msb' | 'lsb';
  /**
   * Specify an explicit initial code-width for the LZW algorithm.
   * @default 8
   */
  literalWidth?: number;
}

export type InitialDictionary = (
  | number
  | number[]
  | Uint8Array
  | Uint8ClampedArray
  | typeof EOF_MARKER
  | typeof RESET_MARKER
)[];

/**
 * Advanced options, allowing for full control of the initial dictionary/decoding state.
 *
 * @example Using a custom LZW dictionary for decoding.
 *
 * ```ts
 * import { Lzw } from '@4bitlabs/codecs';
 *
 * const dictionary = [
 *   Lzw.EOF_MARKER,
 *   0x41, // A
 *   0x42, // B
 *   0x43, // C
 *   0x44, // D
 * ];
 *
 * const bytes = Lzw.unpack(encodedBytes, { dictionary });
 * ```
 *
 * @example Decoding with extended codes in LZW dictionary.
 *
 * Longer codings can be encoded in the dictionary by using either an array of numbers of with a `Uint8Array`:
 *
 * ```ts
 * import { Lzw, EOF_MARKER } from '@4bitlabs/codecs';
 *
 * const dictionary = [
 *   Lzw.EOF_MARKER,
 *   Uint8Array.of(0x47, 0x41, 0x54, 0x41), // GATA
 *   Uint8Array.of(0x41, 0x54, 0x54, 0x41), // ATTA
 *   Uint8Array.of(0x43, 0x47, 0x41, 0x54), // CGAT
 *   Uint8Array.of(0x41, 0x43, 0x41, 0x47), // ACAG
 * ];
 *
 * const bytes = Lzw.unpack(encodedBytes, { dictionary });
 * ```
 */
export interface AdvancedLzwDecodeOptions {
  /**
   * Select the packing bit-ordering.
   * @default 'lsb'
   */
  order?: 'msb' | 'lsb';

  /**
   * Initialize the LZW dictionary.
   */
  dictionary: InitialDictionary;
}

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

type Bytes = Uint8Array | Uint8ClampedArray;

const init = (
  opts: SimpleLzwDecodeOptions | AdvancedLzwDecodeOptions,
): LzwInit => {
  if ('literalWidth' in opts && opts.literalWidth)
    return initFromLiteralWidth(opts.literalWidth);
  if ('dictionary' in opts) return initFromDict(opts.dictionary);

  return initFromLiteralWidth(8);
};

/**
 * [Lempel-Ziv-Welch][lzw] decompression algorithm used in [Sierra On-line][sierra] [SCI-engine][sci0] games.
 *
 * [lzw]: https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch
 * [sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
 * [sci0]: http://sciwiki.sierrahelp.com/index.php/Sierra_Creative_Interpreter
 *
 * @param source The compressed bytes.
 * @param options
 * @returns Decompressed payload.
 *
 * @see {@link SimpleLzwDecodeOptions}
 * @see {@link AdvancedLzwDecodeOptions}
 *
 * @example Basic decoding, using default options.
 *
 * ```ts
 * import { Lzw } from '@4bitlabs/codecs';
 *
 * const encodedBytes = Uint8Array.of(\/* encoded data *\/);
 * const bytes = Lzw.unpack(encodedBytes);
 * ```
 */
export const unpack = (
  source: Uint8Array | Uint8ClampedArray,
  options: SimpleLzwDecodeOptions | AdvancedLzwDecodeOptions = {},
): Uint8Array => {
  const outputs: Bytes[] = [];

  const { order = 'lsb' } = options;
  const { DICTIONARY, TOP, CODE_WIDTH } = init(options);

  let seen = new Map(DICTIONARY);
  let codeWidth = CODE_WIDTH;
  let nextCode = TOP;
  let previous: Bytes | null = null;

  const r = createBitReader(source, { mode: order });

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

    throw new Error(`invalid lzw code: [${next.toString(16)}]`);
  }

  return concat(outputs);
};
