# `@4bitlabs/blur-filters`

A collection of blur-filters for rendering Sierra On-line SCI-engine assets.

## Filters

| Method                                  | Description                                          |
| --------------------------------------- | ---------------------------------------------------- |
| `gaussBlur(sigma: number): ImageFilter` | Applies a gaussian blur to the image in-place        |
| `hBlur(sigma: number): ImageFilter`     | Applies a gaussian blur, only on the horizontal axis |
| `boxBlur(s: number): ImageFilter`       | Applies a _fast_ box-blur of box `s`                 |
| `hBoxBlur(s: number): ImageFilter`      | Applies a _fast_ horizontal box-blur of length `s`   |

### Example:

```ts
import { BlurFilters } from '@4bitlabs/image';

// Blur the image using a horizontal box, with a box of 3-pixels
const filter = BlurFilters.hBoxBlur(3);
const output = filter(source);
```

> Note: These are very naïve implementations, and should _**not**_ be used in any kind of _production_ environment.
