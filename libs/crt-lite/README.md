# `@4bitlabs/crt-lite`

A tiny, simple CRT-like `webgl2`-based canvas renderer for `ImageData`.

| Before                       | After                      |
| ---------------------------- | -------------------------- |
| ![Before processing][before] | ![After processing][after] |

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

[before]: https://private-user-images.githubusercontent.com/73438/317601319-a58e922d-4ca0-4bd0-8c68-7ac128f3ba36.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTE2MDI4ODEsIm5iZiI6MTcxMTYwMjU4MSwicGF0aCI6Ii83MzQzOC8zMTc2MDEzMTktYTU4ZTkyMmQtNGNhMC00YmQwLThjNjgtN2FjMTI4ZjNiYTM2LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAzMjglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMzI4VDA1MDk0MVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWEyOGUzNzE2MGVlZTM0ZjZlYTMxYjgwZTk3ZjY4MTFmYTBhMDhmNTFhMjMxZDI0OGVlNTExNjU3YzIwY2M5ZTUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.NxQdSJwqf9rV7wIhnaUyGWfrr1Lne38tYhM_oePddgo
[after]: https://private-user-images.githubusercontent.com/73438/317601513-93639527-c89b-4e57-acef-43f0bf895ed3.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTE2MDI4ODEsIm5iZiI6MTcxMTYwMjU4MSwicGF0aCI6Ii83MzQzOC8zMTc2MDE1MTMtOTM2Mzk1MjctYzg5Yi00ZTU3LWFjZWYtNDNmMGJmODk1ZWQzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAzMjglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMzI4VDA1MDk0MVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWVhNDc2ZDM1ZGVlOTdiOWM2Yjk3MzNiYzU0ZmQyZmFjMzRjMGNhN2UyYWMwOTUwODIzYmJhMzE2OGNmODU1ZTgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.HDbYWonUmgmgybzB3smD6ctGjOZYmcB7gDW6aZsWlCw
