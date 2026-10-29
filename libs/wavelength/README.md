# @4bitlabs/wavelength 

[![License][license]][npm] 
[![NPM Version][version]][npm] 
[![NPM Downloads][dl]][npm]
[![Ko-fi][kofibadge]][kofi]

[npm]: https://www.npmjs.com/package/@4bitlabs/wavelength
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fwavelength
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fwavelength
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fwavelength
[kofibadge]: https://shields.io/badge/ko--fi-donate-ff5f5f?logo=ko-fi&style=for-the-badgeKo-fi
[kofi]: https://ko-fi.com/thirtytwo

A simple package to approximate wavelengths of visible light into RGB colors. Based on the methodology described in
[Simple Analytic Approximations to the CIE XYZ Color Matching Functions](https://jcgt.org/published/0002/02/01/).

## Hex

Approximate visible light spectrum as hex color codes:

```ts
import { wavelengthToCSS 'hex', } from "@4bitlabs/wavelength";

const blue = wavelengthToCSS('hex', 460);  // "#0000ff"
const green = wavelengthToCSS('hex', 530); // "#00ff00"
const red = wavelengthToCSS('hex', 630);   // "#ff0000"
```

## XYZ

Approximate visible light spectrum as hex color codes:

```ts
import { wavelengthToCss } from "@4bitlabs/wavelength";

const blue = wavelengthToCss('xyz', 460);  // "color(xyz-d50 )"
const green = wavelengthToCss('xyz', 530); // "color(xyz-d50 )"
const red = wavelengthToCss('xyz', 630);   // "color(xyz-d50 )"
```
