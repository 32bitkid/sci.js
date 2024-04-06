# @4bitlabs/crt-lite [![License][license]][npm] [![NPM Version][version]][npm] ![Size][size] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@4bitlabs/crt-lite
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fcrt-lite
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fcrt-lite
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fcrt-lite
[size]: https://img.shields.io/bundlephobia/min/%404bitlabs/crt-lite

A tiny, simple CRT-like `webgl2`-based canvas renderer for `ImageData`.

| Before                                          | After                                        |
| ----------------------------------------------- | -------------------------------------------- |
| [![Before processing][before]][before_fullsize] | [![After processing][after]][after_fullsize] |

## Getting Started

```ts
import { createCrtRenderer } from '@4bitlabs/crt-lite';

// Setup the canvas element to draw to.
const target = document.getElementById('target');
const { update } = createCrtRenderer(canvasEl);

// Get some image data
const source = document.getElementById('source');
const ctx = source.getContext('2d');
/* draw whatever you want */
const imgData = ctx.getImageData(0, 0, ctx.width, ctx.height);

//🪄🎩🐰
update(imgData);
```

## Render Parameters

There are several tunable options when invoking the update function that can be used to adjust the monitor style.

| Setting     | Type      | Description                                                                                                                                     |
| ----------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Fx`        | `number`  | Horizontal monitor curve/barrel distortion.                                                                                                     |
| `Fy`        | `number`  | Vertical monitor curve/barrel distortion.                                                                                                       |
| `S`         | `number`  | Monitor zoom.                                                                                                                                   |
| `hBlur`     | `number`  | Fast <small>GPU</small> horizontal box-blur in pixels.                                                                                          |
| `grain`     | `number`  | Monitor grain. `0.0` = none/off, `1.0` = max.                                                                                                   |
| `vignette`  | `number`  | CRT Vignetting. `0.0` = none/off, `1.0` = max.                                                                                                  |
| `scanLines` | `boolean` | <small><abbr title="Color Graphics Adapter">CGA</abbr>/<abbr title="Enhanced Graphics Adapter">EGA</abbr></small> monitor scan-line simulation. |

```ts
import { createCrtRenderer, type CrtUpdateOptions } from '@4bitlabs/crt-lite';

const { update } = createCrtRenderer(canvasEl);

const crtOptions: CrtUpdateOptions = {
  Fx: -0.025,
  Fy: -0.035,
  S: 0.995,
  hBlur: 2.0,
  grain: 0.125,
  vignette: 1.0,
  scanLines: true,
};

update(imgData, crtOptions);
```

## Setting Render Defaults

You can also set up a set of render defaults as the _base_ for every render.

```ts
import { createCrtRenderer, type CrtUpdateOptions } from '@4bitlabs/crt-lite';

const renderDefaults: CrtUpdateOptions = {
  Fx: -0.025,
  Fy: -0.035,
  S: 0.995,
  hBlur: 2.0,
  grain: 0.125,
  vignette: 1.0,
  scanLines: true,
};

const { update } = createCrtRenderer(canvasEl, { renderDefaults });

// Render using the defaults…
update(imgData);

// Override and disable the grain for just this render.
update(imgData, { grain: 0.0 });
```

[before]: https://j.holmes.codes/images/4bitlabs__crt-lite/before.preview.jpg
[after]: https://j.holmes.codes/images/4bitlabs__crt-lite/after.preview.jpg
[before_fullsize]: https://j.holmes.codes/images/4bitlabs__crt-lite/before.fullsize.webp
[after_fullsize]: https://j.holmes.codes/images/4bitlabs__crt-lite/after.fullsize.webp
