# @4bitlabs/color [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@4bitlabs/color
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fcolor
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fcolor
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fcolor

A collection color manipulation functions and predefined palettes for working with EGA/CGA images.

## Palettes

### Predefined Palettes

| Palette                      |                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `Palettes.CGA_PALETTE`       | IBM's [CGA Palette](https://en.wikipedia.org/wiki/Color_Graphics_Adapter#Color_palette)         |
| `Palettes.TRUE_CGA_PALETTE`  | VileR's ["True" CGA](https://int10h.org/blog/2022/06/ibm-5153-color-true-cga-palette/) Palettte |
| `Palette.DGA_PALETTE`        | Adigun A. Polack's [AAP-DGA16](https://lospec.com/palette-list/aap-dga16)                       |
| `Palette.COLLY_SOFT_PALETTE` | collyflower05's [SOFT CGA PALETTE](https://lospec.com/palette-list/soft-cga)                    |

### Using your own Palette

```ts
const customPalette = Uint32Array.of(
  //AA-BB-GG-RR
  0xff_1f_1f_1f, // color 0
  /*        ...           */
  /* snip 14 more entries */
  /*        ...           */
  0xff_e0_e0_e0, // color 15
);
```

## Predefined Dither Pairs

| Mix                     | Palette  | Mix                            |
| ----------------------- | -------- | ------------------------------ |
| `Dithers.CGA`           | CGA      | _none_                         |
| `Dithers.CGA_MIX`       | CGA      | 25% mix                        |
| `Dithers.CGA_FLAT`      | CGA      | 50% mix (SCUMMVM de-dithering) |
| `Dithers.CGA_SOFT`      | CGA      | Dynamic mix                    |
| `Dithers.TRUE_CGA`      | TRUE-CGA | _none_                         |
| `Dithers.TRUE_CGA_MIX`  | TRUE-CGA | 25% mix                        |
| `Dithers.TRUE_CGA_FLAT` | TRUE-CGA | 50% mix (SCUMMVM de-dithering) |
| `Dithers.TRUE_CGA_SOFT` | TRUE-CGA | Dynamic mix                    |

## Generating your own Dither Pairs

```ts
import { generateSciDitherPairs, Mixers } from '@4bitlabs/color';

const pairs = generateSciDitherPairs(customPalette, Mixers.softMixer());
```

## IBM 5153 Contrast Knob

```ts
import { IBM5153Contrast } from '@4bitlabs/color';

// Simulate turning the constrast knob on a IBM-5153 to about 50%
const palette = IBM5153Contrast(Palettes.CGA_PALETTE, 0.5);
```

## Simulating Grayscale

```ts
const grays = toGrayscale(Palettes.CGA_PALETTE);
```
