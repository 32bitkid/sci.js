# `@4bitlabs/blur-filters`

A collection of pixel resize filters for rendering [Sierra On-line][sierra] [SCI-engine][sci0] assets.

## Nearest-Neighbor

```ts
import { nearestNeighbor } from '@4bitlabs/image';

// scale up the image by 3x both horizontally and vertically
const output = nearestNeighbor([3, 3])(source);
```

## Scale2×

Scale the source `ImageData` using the [Scale2×][scale2x] algorithm.

```ts
import { scale2x } from '@4bitlabs/image';

// scale the using the Scale2× algorithm
const output = scale2x(source);
```

## Scale3×

Scale the source `ImageData` using the [Scale3×][scale3x] algorithm.

```ts
import { scale3x } from '@4bitlabs/image';

// scale the image using the Scale3× algorithm
const output = scale3x([3, 3])(source);
```

## Scale5×6

A variant of the [Scale3×][scale3x] algorithm, but scales each pixel to 5×6 block. This incidentally matches the pixel aspect-ratio
of CGA/EGA (`1.2`) graphics when displayed on modern LCD-displays with a 1∶1 pixel aspect-ratio.

```ts
import { scale5x6 } from '@4bitlabs/image';

const output = scale5x6(source);
```

[sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
[scale2x]: https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#EPX/Scale2%C3%97/AdvMAME2%C3%97
[scale3x]: https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#Scale3%C3%97/AdvMAME3%C3%97_and_ScaleFX
[sci0]: http://sciwiki.sierrahelp.com/index.php/Sierra_Creative_Interpreter
