# SCI.js

A collection of packages, utilities and apps for encoding and decoding assets from [Sierra On-line][sierra] [SCI-engine][sci0] games.

> Warning: This monorepo is a work-in-progress.

## General Purpose

- [`@4bitlabs/vec2`](./libs/vec2/README.md): A simple collection of functions for working with two-component vectors.

## Image-related packages

- [`@4bitlabs/color-space`](./libs/color-space/README.md): Utility functions for parsing, converting and mixing colors in sRGB, CIE-XYZ, CIELAB, and okLab color spaces
- [`@4bitlabs/color`](./libs/color/README.md): CGA/EGA palette definitions and CGA color manipulation utilities.
- [`@4bitlabs/image`](./libs/image/README.md): Basic primitives for working with `ImageData` and 8-bit indexed-pixel data.
- [`@4bitlabs/resize-filters`](./libs/resize-filters/README.md): Various image filters for resizing `ImageData` and 8-bit indexed-pixel data.
- [`@4bitlabs/blur-filters`](./libs/blur-filters/README.md): Various image filters for blurring `ImageData` and 8-bit indexed-pixel data.

## <abbr title="Sierra Creative Interpreter">SCI</abbr> packages

- [`@4bitlabs/codecs`](./libs/codecs/README.md): Some common decompression algorithms, _e.g._ `Huffman` and `LZW`.
- [`@4bitlabs/sci0`](./libs/sci0/README.md): Data-structures and methods for decoding and parsing SCI0/SCI01-engine
  resources.

## Applications

- [`@4bitlabs/scibud`](./apps/scibud/README.md): A handy <abbr title="Command-line interface">CLI</abbr> tool for
  decoding and rendering SCI0/SCI01-engine resources.

## Other

- [`@4bitlabs/crt-lite`](./libs/crt-lite/README.md): A WebGL renderer for `ImageData` that replicates some of the basic
  look and feel of <abbr title="Cathode-ray Tube">CRT</abbr> monitors.

[sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
[sci0]: http://sciwiki.sierrahelp.com/index.php/Sierra_Creative_Interpreter
