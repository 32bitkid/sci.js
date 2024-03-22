import { ImageDataLike, IndexedPixelData } from '@4bitlabs/image';

export interface ImageResizer {
  (source: ImageDataLike): ImageDataLike;
  (source: IndexedPixelData): IndexedPixelData;
}
