# @4bitlabs/image [![License][license]][npm] [![NPM Version][version]][npm] ![Size][size] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@4bitlabs/image
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fimage
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fimage
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fimage
[size]: https://img.shields.io/bundlephobia/min/%404bitlabs/image

A collection of image primitives and manipulation functions for rendering [Sierra On-line][sierra] SCI-engine assets.

## Palette Filter

The `createPaletteFilter()` function generates a _palette filter_ for processing 4-bit pixel data from `view`, `cursor`,
and `font` assets.

```ts
import { Palettes } from '@4bitlabs/color';
import { createPaletteFilter } from '@4bitlabs/image';

// Generate a classic 1x1 EGA dither
const dither = createPaletteFilter(Palettes.CGA);
const ouput = dither(visual);
```

## Dither Filter

The `createDitherFilter()` function generates a _dither filter_ for processing 8-bit dither-pairs from raw render data
of `visual` layer SCI-engine PIC assets.

```ts
import { Dithers } from '@4bitlabs/color';
import { createDitherFilter } from '@4bitlabs/image';

// Generate a classic 1x1 EGA dither
const dither = createDitherFilter(Dithers.CGA);
const ouput = dither(visual);
```

## Executing Pipelines

You can also execute more complex transformation pipelines with `renderPixelData()` for both paletted and dithered
pixel-data.

```ts
import { Palette, Dithers } from '@4bitlabs/color';
import { scale5x6 } from '@4bitlabs/blur-filters';
import { hBoxBlur } from '@4bitlabs/blur-filters';
import {
  renderPixelData,
  createDitherFilter,
  type RenderPipeline,
} from '@4bitlabs/image';

const imageData = renderPixelData(visual, {
  // First, scale the image using the scale5x6 algorithm
  pre: [scale5x6],
  // Dither with CGA pairs, using a 5 by 6 pattern
  dither: createDitherFilter(Dithers.CGA, [5, 6]),
  // Finally, apply a horizontal box blur to the image
  post: [hBoxBlur(3)], //
});
```

[sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
