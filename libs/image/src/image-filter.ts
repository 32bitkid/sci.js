import type { ImageDataLike } from './image-data-like.js';
import type { IndexedPixelData } from './indexed-pixel-data.js';

export type PixelFilter = (source: IndexedPixelData) => IndexedPixelData;
export type PaletteFilter = (source: IndexedPixelData) => ImageDataLike;
export type ImageFilter = (source: ImageDataLike) => ImageDataLike;
export type GenericFilter = <T extends ImageDataLike | IndexedPixelData>(
  input: T,
) => T;
