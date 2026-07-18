import type { GenericFilter } from './image-filter.js';
import {
  type IndexedPixelData,
  isIndexedPixelData,
} from './indexed-pixel-data.js';
import type { ImageDataLike } from './image-data-like.js';
import { type Padding, toPadding4 } from './padding.js';
import { padIndexedPixelDataFilter } from './pad-pixels-filter.js';
import { padImageDataFilter } from './pad-image-filter.js';

export const padFilter = (n: Padding): GenericFilter => {
  const pad = toPadding4(n);
  return <T extends ImageDataLike | IndexedPixelData>(source: T): T =>
    (isIndexedPixelData(source)
      ? padIndexedPixelDataFilter(source, pad)
      : padImageDataFilter(source, pad)) as T;
};
