# @4bitlabs/color-space [![License][license]][npm] [![NPM Version][version]][npm] ![Size][size] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@4bitlabs/color-space
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fcolor-space
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fcolor-space
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fcolor-space
[size]: https://img.shields.io/bundlephobia/min/%404bitlabs/color-space

Utility functions for parsing, converting and mixing colors in sRGB, CIE-XYZ, CIE-L\*a\*b\*, and okLab color spaces

## Installing

```bash
$ npm install --save @4bitlabs/color-space
```

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

The following package exports are available:

| Color-Space                                                       | Import                                                          |
| ----------------------------------------------------------------- | --------------------------------------------------------------- |
| [sRGB](https://en.wikipedia.org/wiki/SRGB)                        | `import * as sRGB from "@4bitlabs/color-space/srgb"`            |
| [CIE-XYZ](https://en.wikipedia.org/wiki/CIE_1931_color_space)     | `import * as XYZ from "@4bitlabs/color-space/xyz"`              |
| [CIE-L\*a\*b\*](https://en.wikipedia.org/wiki/CIELAB_color_space) | `import * as CIELab from "@4bitlabs/color-space/lab"`           |
| [OKlab](https://bottosson.github.io/posts/oklab/)                 | `import * as okLab from "@4bitlabs/color-space/oklab"`          |
| linear RGB                                                        | `import * as linearRGB from "@4bitlabs/color-space/linear-rgb"` |

## sRGB colors

```ts
import {
  fromHex,
  fromUint24,
  mix,
  toHex,
  toString,
  type sRGBTuple,
} from '@4bitlabs/color-space/srgb';

// Parse from hex code
const color1: sRGBTuple = fromHex('#ff6347');

// Parse from a uint24 in 0xBBGGRR byte order.
const color2: sRGBTuple = fromUint24(0xed9564);

// Mix color 1 and color 2 at 50% in sRGB color-space.
const color3: sRGBTuple = mix(color1, color2, 0.5);

console.log(toHex(color3)); // "#b17c9a"
console.log(toString(color3)); // "rgb(177 124 154)"
```

## CIE-XYZ colors

```ts
import {
  create,
  mix,
  toString,
  type XYZTuple,
} from '@4bitlabs/color-space/xyz';

const cornflowerBlue: XYZTuple = create(50.39, 57.009, 86.941);
const black: XYZTuple = create(0, 0, 0);

// Mix cornflowerBlue and black at 50% in XYZ color-space.
const mixed = mix(cornflowerBlue, black, 0.5);

console.log(toString(mixed)); // color(xyz 0.251 0.285 0.434)
```

## CIE-LAB colors

```ts
import {
  create,
  mix,
  toString,
  type LabTuple,
} from '@4bitlabs/color-space/lab';

const forestGreen: LabTuple = create(50.593, -49.586, 45.015);
const white: LabTuple = create(100, -0, -0.009);

// Mix forestGreen and white at 50% in CIE-Lab color-space.
const mixed = mix(forestGreen, white, 0.5);

console.log(toString(mixed)); // lab(75.297 -24.793 22.503)
```

## Oklab colors

```ts
import { create, mix, type okLabTuple } from '@4bitlabs/color-space/oklab';

const salmon: okLabTuple = create(0.8, 0.144, 0.083);
const cyan: okLabTuple = create(0.8, -0.125, -0.217);

// Mix salmon and cyan at 50% in okLab color-space.
const mixed = mix(salmon, cyan, 0.5);

console.log(mixed); // oklab(0.8 0.009 -0.067)
```

## Conversions

`sRGB` ➡️ `XYZ`

```ts
import { sRGB } from '@4bitlabs/color-space';
const xyz = sRGB.toXYZ(color);
```

`XYZ` ➡️ `Lab`:

```ts
import { XYZ } from '@4bitlabs/color-space';
const lab = XYZ.toLab(color);
```

`XYZ` ➡️ `okLab`:

```ts
import { XYZ } from '@4bitlabs/color-space';
const oklab = XYZ.toOkLab(color);
```

`okLab` ➡️ `XYZ`:

```ts
import { okLab } from '@4bitlabs/color-space';
const xyz = okLab.toXYZ(color);
```

`Lab` ➡️ `XYZ`:

```ts
import { Lab } from '@4bitlabs/color-space';
const xyz = Lab.toXYZ(color);
```

`XYZ` ➡️ `sRGB`:

```ts
import { XYZ } from '@4bitlabs/color-space';
const xyz = XYZ.toSRGB(color);
```

`sRGB` ➡️ `linear-RGB`:

```ts
import { sRGB } from '@4bitlabs/color-space';
const linearRGB = sRGB.toLinearRGB(color);
```

`linear-RGB` ➡️ `sRGB`:

```ts
import { linearRGB } from '@4bitlabs/color-space';
const sRBG = linearRGB.toSRGB(color);
```

## Serialization & Storage

The color objects are backed by a simple-array that are _easy and safe_ to serialize and
deserialize, however you like. They also do not require any special _parsing_ phase after
deserialization, you can just use them like you normally would use them.

```ts
import { fromHex, toString } from '@4bitlabs/srgb';

const themeColor = fromHex('#ff6347');

const payload = { theme: { primaryColor: themeColor } };
const json = JSON.stringify(payload);

/* { "theme": { "primaryColor": ["sRGB", 255, 99, 71] } } */

const {
  theme: { primaryColor },
} = JSON.parse(json);

console.log(toString(primaryColor)); // rgb(255 99 71);
```

If you are parsing from a untrusted or unverifed source, then you can use the included type-predicates to enforce
proper structure:

```ts
import { toString, isSRGBTuple } from '@4bitlabs/srgb';

const {
  theme: { primaryColor },
} = JSON.parse(json);

if (isSRGBTuple(primaryColor)) {
  // primaryColor is definitely a sRGB color
  console.log(toString(primaryColor)); // rgb(255 99 71);
}
```
