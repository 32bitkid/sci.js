# `@4bitlabs/image`

A collection of scalers, image-filters and palette manipulation functions for rendering [Sierra On-line][sierra] SCI-engine assets.

## Ditherizer

This method creates a _ditherizer_ for processing the raw render data from SCI-engine PIC assets.

```ts
const dither = createDitherizer(palette, [3, 3]);
const ouput = dither(source);
```

[sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
[scale2x]: https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#EPX/Scale2%C3%97/AdvMAME2%C3%97
[scale3x]: https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#Scale3%C3%97/AdvMAME3%C3%97_and_ScaleFX
