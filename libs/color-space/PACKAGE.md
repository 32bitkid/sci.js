[![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@4bitlabs/color-space
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fcolor-space
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fcolor-space
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fcolor-space

Utility functions for parsing, converting and mixing colors in sRGB, CIE-XYZ, CIE-L\*a\*b\*, and okLab color spaces

## Supported Color Spaces

- {@link sRGB} - 8-bit gamma-compressed [sRGB](https://en.wikipedia.org/wiki/SRGB) color space.
- {@link linearRGB} - Linear, non gamma-compressed, [sRGB](https://en.wikipedia.org/wiki/SRGB) color space.
- {@link XYZ} - [CIE-XYZ](https://en.wikipedia.org/wiki/CIE_1931_color_space) color space.
- {@link Lab} - [CIE-L\*a\*b\*](https://en.wikipedia.org/wiki/CIELAB_color_space) color space.
- {@link okLab} - [Oklab](https://bottosson.github.io/posts/oklab/) color space.

## Basic Usage

```ts
import { sRGB, XYZ, Lab, okLab, linearRGB } from '@4bitlabs/color-space';

const srgbColor = sRGB.create(255, 128, 0);
const xyzColor = XYZ.create(50.39, 57.009, 86.941);
const labColor = Lab.create(50.593, -49.586, 45.015);
const oklabColor = okLab.create(0.8, 0.144, 0.083);
const linearRGBColor = linearRGB.create(0.5, 0.5, 0.5);
```

## Imports

The following [package exports](https://nodejs.org/api/packages.html#package-entry-points) are available:

### [sRGB](https://en.wikipedia.org/wiki/SRGB)

```ts
import * as sRGB from '@4bitlabs/color-space/srgb';
```

### [CIE-XYZ](https://en.wikipedia.org/wiki/CIE_1931_color_space)

```ts
import * as XYZ from '@4bitlabs/color-space/xyz';
```

### [CIE-L\*a\*b\*](https://en.wikipedia.org/wiki/CIELAB_color_space)

```ts
import * as CIELab from '@4bitlabs/color-space/lab';
```

### [OKlab](https://bottosson.github.io/posts/oklab/)

```ts
import * as okLab from '@4bitlabs/color-space/oklab';
```

### linear RGB

```ts
import * as linearRGB from '@4bitlabs/color-space/linear-rgb';
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
