import { ImageDataLike } from './image-data-like';
import { IndexedPixelData } from './indexed-pixel-data';

export type PixelFilter = (source: IndexedPixelData) => IndexedPixelData;
export type PixelImageFilter = (source: IndexedPixelData) => ImageDataLike;
export type ImageFilter = (source: ImageDataLike) => ImageDataLike;
