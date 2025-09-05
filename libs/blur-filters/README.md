# @4bitlabs/blur-filters [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@4bitlabs/blur-filters
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fblur-filters
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fblur-filters
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fblur-filters

A collection of blur-filters for rendering [Sierra On-line][sierra] [SCI-engine][sci0] assets.

## Documentation

Full documentation for the library can be found [here][docs].

[docs]: https://32bitkid.github.io/sci.js/modules/_4bitlabs_blur-filters.html

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

[sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
[sci0]: http://sciwiki.sierrahelp.com/index.php/Sierra_Creative_Interpreter
