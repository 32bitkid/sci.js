# @4bitlabs/codecs [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@4bitlabs/codecs
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fcodecs
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fcodecs
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fcodecs

A collection of decoders (and eventually encoders) for working with [Sierra On-line][sierra] [SCI-engine][sci0] assets.

## Supported Codecs

| Name                    | Decoder | Encoder |
| ----------------------- | :-----: | :-----: |
| [Huffman][huffman]      |   ✅    |         |
| [Lempel–Ziv–Welch][lzw] |   ✅    |         |
| COMP3                   |   ✅    |         |

## Huffman

Example decoding bytes with [Huffman][huffman]:

```ts
import { Huffman } from '@4bitlabs/codecs';

const encodedBytes = Uint8Array.of(/* encoded data */);
const bytes = Huffman.unpack(encodedBytes);
```

## Lempel–Ziv–Welch

Example decoding bytes with [Lempel-Ziv-Welch][lzw]:

```ts
import { Lzw } from '@4bitlabs/codecs';

const encodedBytes = Uint8Array.of(/* encoded data */);
const bytes = Lzw.unpack(encodedBytes);
```

### Custom LZW Options

By default, most-significant bit ordering is used. You can change the encoded byte ordering of the decoder with the `options` parameter. To use least-significant bit
ordering:

```ts
const bytes = Lzw.unpack(encodedBytes, { order: 'lsb' });
```

The default _code-width_ it uses is `8`, this can also be adjusted. To use a 7-bit code width:

```ts
const bytes = Lzw.unpack(encodedBytes, { literalWidth: 7 });
```

Also, an entirely custom LZW dictionaries can be used for decoding:

```ts
import { Lzw } from '@4bitlabs/codecs';

const dictionary = [
  Lzw.EOF_MARKER,
  0x41, // A
  0x42, // B
  0x43, // C
  0x44, // D
];

const bytes = Lzw.unpack(encodedBytes, { dictionary });
```

Longer codings can be encoded in the dictionary by using either an array of numbers of with a `Uint8Array`:

```ts
import { Lzw, EOF_MARKER } from '@4bitlabs/codecs';

const dictionary = [
  Lzw.EOF_MARKER,
  Uint8Array.of(0x47, 0x41, 0x54, 0x41), // GATA
  Uint8Array.of(0x41, 0x54, 0x54, 0x41), // ATTA
  Uint8Array.of(0x43, 0x47, 0x41, 0x54), // CGAT
  Uint8Array.of(0x41, 0x43, 0x41, 0x47), // ACAG
];

const bytes = Lzw.unpack(encodedBytes, { dictionary });
```

## `SCI01`/`SCI1`-engine COMP3

`COMP3` compression is used in `SCI01`/`SCI1` engine games, it is a 9–12 bit variable length encoding.

Example decoding bytes with `COMP3` compression:

```ts
import { Comp3 } from '@4bitlabs/codecs';

const encodedBytes = Uint8Array.of(/* encoded data */);
const bytes = Comp3.unpack(encodedBytes);
```

[sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
[huffman]: https://en.wikipedia.org/wiki/Huffman_coding
[lzw]: https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch
[sci0]: http://sciwiki.sierrahelp.com/index.php/Sierra_Creative_Interpreter
