# `@4bitlabs/readers`

A collection of bit-readers for javascript and typescript.

## What is a bit-reader?

A bit-reader allows for bits level access to a sequence of bytes, allowing bit-level reads that easily cross byte-level 
boundaries. You can think of a bit-reader like a long sequence of bits that can be _shifted_ off, providing access to
later bits. Consider:

```js
const source = Uint8Array.of(
    0b1111_0011, 
    0b1100_1111, 
    0b1010_1010,
)
```

If you wanted the _most-significant_ 4-bits of this byte sequence, you could use a bitmask and a bitwise shifts:

```js
const value = (source[0] & 0b1111_0000) >>> 4; // 15
```

This can be useful for simple encoded data, however, can become unweildly when crossing multiple bytes. Let's say you 
wanted to get the bits

```text
        From           To
         |--------------|
         v              v
0b1111_0011_1100_1111_1010_1010
```

With bitwise operators on a `Uint8Array`, you'd have to:

```js
const value = 
    // select and shift the most-significant bits
    (source[0] & 0b0000_0011) << 10 |
    // select and shift the middle bits
    (source[1]) << 2 | 
    // select and shift the least-significant bits
    (source[2] & 0b1100_0000) >>> 6;
```

With a bit-reader, you can instead say:

```js
const reader = new BitReader(source);
reader.skip(6);   // skip the first 6 bits
const value = reader.read(12);  // take the next 12 bits
```


This can be very useful when parsing densely-packed data-structures, especially when they use *variable-length* encoding. 

## `BitReader`

`BitReader` provides a bit-reader that sequentially reads bits from an `Uint8Array` source.

```js
// All ones
const source = Uint8Array.of(
    0b1110_0001,
);
const r = new BitReader(source);

r.read32(3); // 0b111
r.read32(1); // 0b0
r.read32(3); // 0b000
r.read32(1); // 0b1
```

The default behavior to read **most-significant bits** first, however, you can select reading from the 
**least-significant** side:

```js
// All ones
const source = Uint8Array.of(
    0b1110_0001,
);
const r = new BitReader(source, { mode: "lsb" });

r.read32(3); // 0b001
r.read32(1); // 0b0
r.read32(3); // 0b110
r.read32(1); // 0b1
```

## `AsyncBitReader`

`AsyncBitReader` provides a bit-reader that sequentially reads bits from an `AsyncIterable`. This allows it to consume 
bytes from a variety of sources, from files and network sources. For instance:

```js
import fs from "node:fs";

const source = fs.createReadStream(path, { encoding: 'utf-8' });
const reader = new AsyncBitReader(source);
/* ...start reading! */ 
```

## Limitations

As of the _initial_ version, both `BitReader` and `AsyncBitReader` only support a maximum of **32-bit** reads at time. 
However, those **32-bits** do not need to be _byte-aligned_ bits, and can occur anywhere in the bitstream. This limitation
is due to the precision of the bitwise operators in javascript. In the future, this might be addressed to allow for 
53-bit reads, the maximum-safe integer size for double-precision numbers.   