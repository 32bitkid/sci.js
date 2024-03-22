import { ImageDataLike } from '../image-data-like';
import { IndexedPixelData } from '../indexed-pixel-data';

export interface ImageResizer {
  (source: ImageDataLike): ImageDataLike;
  (source: IndexedPixelData): IndexedPixelData;
}
