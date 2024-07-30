A collection of packages, utilities and apps for encoding and decoding assets from [Sierra On-line][sierra] [SCI-engine][sci0] games.

### General Purpose

- {@link @4bitlabs/vec2! | @4bitlabs/vec2}: A simple collection of functions for working with two-component vectors.

### Image-related packages

- {@link @4bitlabs/color-space! | @4bitlabs/color-space }: Utility functions for parsing, converting and mixing colors in sRGB, CIE-XYZ, CIELAB, and okLab color spaces
- {@link @4bitlabs/color! | @4bitlabs/color} : CGA/EGA palette definitions and CGA color manipulation utilities.
- {@link @4bitlabs/image! | @4bitlabs/image} : Basic primitives for working with `ImageData` and 8-bit indexed-pixel data.
- {@link @4bitlabs/resize-filters! | @4bitlabs/resize-filters}: Various image filters for resizing `ImageData` and 8-bit indexed-pixel data.
- {@link @4bitlabs/blur-filters! | @4bitlabs/blur-filters}: Various image filters for blurring `ImageData` and 8-bit indexed-pixel data.

### <abbr title="Sierra Creative Interpreter">SCI</abbr> packages

- {@link @4bitlabs/codecs! | @4bitlabs/codecs}: Some common decompression algorithms, _e.g._ `Huffman` and `LZW`.
- {@link @4bitlabs/sci0! | @4bitlabs/sci0}: Data-structures and methods for decoding and parsing SCI0/SCI01-engine
  resources.

[sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
[sci0]: http://sciwiki.sierrahelp.com/index.php/Sierra_Creative_Interpreter
