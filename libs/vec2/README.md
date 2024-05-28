# @4bitlabs/vec2 [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@4bitlabs/vec2
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fvec2
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fvec2
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fvec2

A simple collection of functions for working with two-component vectors.

## Basic Usage

```ts
import { type Vec2, vec2, toString, dot } from '@4bitlabs/vec2';

const v1: Vec2 = vec2(8.14, 10.1);
const v2: Vec2 = vec2(1.45, 3.92);

const result = dot(v1, v2);

console.log(
  `The dot-product of ${toString(v1)} and ${toString(v2)} is ${result}`,
);
```
