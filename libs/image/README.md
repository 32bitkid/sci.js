# `@4bitlabs/image`

A collection of scalers, image-filters and palette manipulation functions for rendering [Sierra On-line][sierra] SCI-engine assets.

## Scalers

### Nearest-Neighbor

```ts
import { nearestNeighbor } from '@4bitlabs/image';

// scale up the image by 3x both horizontally and vertically
const output = nearestNeighbor([3, 3])(source);
```

### Scale2×

Scale the source `ImageData` using the [Scale2×][scale2x] algorithm.

```ts
import { scale2x } from '@4bitlabs/image';

// scale the using the Scale2× algorithm
const output = scale2x(source);
```

### Scale3×

Scale the source `ImageData` using the [Scale3×][scale3x] algorithm.

```ts
import { scale3x } from '@4bitlabs/image';

// scale the image using the Scale3× algorithm
const output = scale3x([3, 3])(source);
```

### Scale5×6

A variant of the [Scale3×][scale3x] algorithm, but scales each pixel to 5×6 block. This incidentally matches the pixel aspect-ratio
of CGA/EGA (`1.2`) graphics when displayed on modern LCD-displays with a 1∶1 pixel aspect-ratio.

```ts
import { scale5x6 } from '@4bitlabs/image';

const output = scale5x6(source);
```

## Filters

- `gaussBlur(image: ImageData, sigma: number): void` Applies a gaussian-blur to the image in-place.
- `hBlur(image: ImageData, sigma: number): void` Applies a hortizontal-blur to the image in-place.

> Note: These are very naïve implementations, and should _not_ be used in any kind of _production_ environment.

## Ditherizer

This method creates a _ditherizer_ for processing the raw render data from SCI-engine PIC assets.

```ts
const dither = createDitherizer(palette, [3, 3]);
const ouput = dither(source);
```

[sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
[scale2x]: https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#EPX/Scale2%C3%97/AdvMAME2%C3%97
[scale3x]: https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#Scale3%C3%97/AdvMAME3%C3%97_and_ScaleFX
