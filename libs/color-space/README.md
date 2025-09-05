# @4bitlabs/color-space [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@4bitlabs/color-space
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fcolor-space
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fcolor-space
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fcolor-space

Utility functions for parsing, converting and mixing colors in sRGB, CIE-XYZ, CIE-L\*a\*b\*, and okLab color spaces

## Installing

```bash
$ npm install --save @4bitlabs/color-space
```

## Documentation

Full documentation for the library can be found [here][docs].

[docs]: https://32bitkid.github.io/sci.js/modules/_4bitlabs_color-space.html

## Quick-start

```ts
import { sRGB, XYZ, Lab, okLab, linearRGB } from '@4bitlabs/color-space';

const srgbColor = sRGB.create(255, 128, 0);
const xyzColor = XYZ.create(50.39, 57.009, 86.941);
const labColor = Lab.create(50.593, -49.586, 45.015);
const oklabColor = okLab.create(0.8, 0.144, 0.083);
const linearRGBColor = linearRGB.create(0.5, 0.5, 0.5);
```

You can also import only the specific color-spaces you intend to work by using package exports:

```ts
import * as sRGB from '@4bitlabs/color-spaces/srgb';
import * as XYZ from '@4bitlabs/color-spaces/xyz';

const tomato = sRGB.fromHex('#ff6347');
const xyzTomato = sRGB.toXYZ(tomato);
const xyzString = XYZ.toString(xyzTomato);
```
