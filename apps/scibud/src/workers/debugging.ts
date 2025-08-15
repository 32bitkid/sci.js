import type { Console } from 'node:console';

import type {
  ImageDataLike,
  ImageFilter,
  PixelFilter,
  IndexedPixelData,
  PaletteFilter,
} from '@4bitlabs/image';

export const addImageTiming =
  (
    fn: ImageFilter,
    label = 'image',
    console: Console = global.console,
  ): ImageFilter =>
  (img: ImageDataLike): ImageDataLike => {
    console.time(label);
    const result = fn(img);
    console.timeEnd(label);
    return result;
  };

export const addPixelTiming =
  (
    fn: PixelFilter,
    label = 'pixel',
    console: Console = global.console,
  ): PixelFilter =>
  (img: IndexedPixelData): IndexedPixelData => {
    console.time(label);
    const result = fn(img);
    console.timeEnd(label);
    return result;
  };

export const addPaletteTiming =
  (
    fn: PaletteFilter,
    label = 'palette',
    console: Console = global.console,
  ): PaletteFilter =>
  (img: IndexedPixelData): ImageDataLike => {
    console.time(label);
    const result = fn(img);
    console.timeEnd(label);
    return result;
  };
