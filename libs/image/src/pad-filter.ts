import { type GenericFilter, ImageFilter } from './image-filter';
import {
  type IndexedPixelData,
  isIndexedPixelData,
} from './indexed-pixel-data';
import { createImageData, ImageDataLike } from './image-data-like';
import { type Padding, type PadQuad, toPadding4 } from './padding';
import { padIndexedPixelDataFilter } from './pad-pixels-filter';
import { padImageDataFilter } from './pad-image-filter';

export const padFilter = (n: Padding): GenericFilter => {
  const pad = toPadding4(n);
  return <T extends ImageDataLike | IndexedPixelData>(source: T): T =>
    (isIndexedPixelData(source)
      ? padIndexedPixelDataFilter(source, pad)
      : padImageDataFilter(source, pad)) as T;
};
