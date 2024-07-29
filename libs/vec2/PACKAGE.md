[![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@4bitlabs/vec2
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fvec2
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fvec2
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fvec2

A simple collection of functions for working with two-component vectors.

#### Example: Finding the distance between two points.

```ts
import { distanceBetween, vec2 } from '@4bitlabs/vec2';

const a = vec2(10, 20);
const b = vec2(3, 4);
const dist = distanceBetween(a, b);
```
