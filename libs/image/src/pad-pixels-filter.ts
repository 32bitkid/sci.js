import { PixelFilter } from './image-filter';
import {
  type IndexedPixelData,
  createIndexedPixelData,
} from './indexed-pixel-data';
import { type Padding, type PadQuad, toPadding4 } from './padding';

export interface PadPixelsFilterOptions {
  keyColor?: number;
}

export const padIndexedPixelDataFilter = (
  source: IndexedPixelData,
  [padT, padR, padB, padL]: PadQuad,
  options: PadPixelsFilterOptions = {},
): IndexedPixelData => {
  const keyColor = options.keyColor ?? source.keyColor;
  const dest = createIndexedPixelData(
    padL + source.width + padR,
    padT + source.height + padB,
    { keyColor },
  );

  for (let y = 0; y < source.height; y++) {
    const srcIdx = y * source.width;
    const row = source.pixels.subarray(srcIdx, srcIdx + source.width);

    const dstIdx = (y + padT) * dest.width + padL;
    dest.pixels.set(row, dstIdx);
  }
  return dest;
};

export const padPixelsFilter = (
  n: Padding,
  options?: PadPixelsFilterOptions,
): PixelFilter => {
  const pad = toPadding4(n);
  return (source: IndexedPixelData): IndexedPixelData =>
    padIndexedPixelDataFilter(source, pad, options);
};
