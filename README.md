# SCI.js

A collection of packages, utilities and apps for decoding assets from

This monorepo is a work-in-progress.

## General packages

- [`@4bitlabs/readers`](./libs/readers/README.md): Basic implementations of `BitReader` in JavaScript/TypeScript.
- [`@4bitlabs/codecs`](./libs/codecs/README.md): Some common decompression algorithms, _e.g._ `Huffman` and `LZW`.
- [`@4bitlabs/numeric-deque`](./libs/numeric-deque/README.md): A simple, performant, general-purpose
  <abbr title="double-ended queue">_deque_</abbr>, backed by a `TypedArray`.

## Image-related packages

- [`@4bitlabs/color-space`](./libs/color-space/README.md): Utility functions for parsing, converting and mixing colors in sRGB, CIE-XYZ, CIELAB, and okLab color spaces
- [`@4bitlabs/color`](./libs/color/README.md): CGA/EGA palette definitions and CGA color manipulation utilities.
- [`@4bitlabs/image`](./libs/image/README.md): Basic primitives for working with `ImageData` and 8-bit indexed-pixel data.
- [`@4bitlabs/resize-filters`](./libs/resize-filters/README.md): Various image filters for resizing `ImageData` and 8-bit indexed-pixel data.
- [`@4bitlabs/blur-filters`](./libs/blur-filters/README.md): Various image filters for blurring `ImageData` and 8-bit indexed-pixel data.

## <abbr title="Sierra Creative Interpreter">SCI</abbr> packages

- [`@4bitlabs/sci0`](./libs/sci0/README.md): Data-structures and methods for decoding and parsing SCI0/SCI01-engine
  resources.

## Applications

- [`@4bitlabs/scibud`](./apps/scibud/README.md): A handy <abbr title="Command-line interface">CLI</abbr> tool for
  decoding and rendering SCI0/SCI01-engine resources.

## Other

- [`@4bitlabs/crt-lite`](./libs/crt-lite/README.md): A WebGL renderer for `ImageData` that replicates some of the basic
  look and feel of <abbr title="Cathode-ray Tube">CRT</abbr> monitors.
