import { ImageDataLike } from '@4bitlabs/image';
import { CLASSIC, MIX, SOFT } from './screen-palettes';

export type Ditherizer = (source: ImageDataLike) => ImageDataLike;

export const createDitherizer =
  (pal: [number, number][], ditherSize: [number, number] = [1, 1]) =>
  (source: ImageDataLike): ImageDataLike => {
    const inputBuffer = new Uint32Array(
      source.data.buffer,
      source.data.byteOffset,
      source.data.byteLength / 4,
    );

    const dithered = new Uint8ClampedArray(source.data.length);
    const ditheredBuffer = new Uint32Array(
      dithered.buffer,
      dithered.byteOffset,
      dithered.byteLength / 4,
    );

    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        const idx = x + y * source.width;
        const src = inputBuffer[idx];
        if ((src & 0xff000000) === 0) continue;

        const [dx, dy] = [~~(x / ditherSize[0]), ~~(y / ditherSize[1])];
        const dither = (dx & 1) ^ (dy & 1);

        const [a, b] = pal[src & 0xff];
        ditheredBuffer[idx] = dither ? a : b;
      }
    }
    return {
      data: dithered,
      width: source.width,
      height: source.height,
    };
  };

export const classicDitherer: Ditherizer = createDitherizer(CLASSIC);
export const mixDitherer: Ditherizer = createDitherizer(MIX);
export const softDitherer: Ditherizer = createDitherizer(SOFT);
