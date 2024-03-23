# `@4bitlabs/image`

A collection of image primitives and manipulation functions for rendering [Sierra On-line][sierra] SCI-engine assets.

## Dither Filter

This method creates a _dither filter_ for processing the raw render data from SCI-engine PIC assets.

```ts
const dither = createDitherFilter(palette, [3, 3]);
const ouput = dither(source);
```

[sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
