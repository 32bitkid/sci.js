import { ImageDataLike } from './image-data-like';

export type Ditherizer = (source: ImageDataLike) => ImageDataLike;

export const createDitherizer = (
  pal: [number, number][],
  ditherSize: [number, number] = [1, 1],
) =>
  function ditherizerFilter(source: ImageDataLike): ImageDataLike {
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

        const dx = (x / ditherSize[0]) & 1;
        const dy = (y / ditherSize[1]) & 1;
        const dither = dx ^ dy;

        ditheredBuffer[idx] = pal[src & 0xff][dither ? 0 : 1];
      }
    }
    return {
      data: dithered,
      width: source.width,
      height: source.height,
    };
  };
