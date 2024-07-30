import { createImageData, ImageDataLike } from './image-data-like';
import { type Padding, type Padding4, toPadding4 } from './padding';
import { ImageFilter } from './image-filter';

export interface PadImageFilterOptions {
  backgroundColor?: number;
}

export const padImageDataFilter = (
  source: ImageDataLike,
  [padT, padR, padB, padL]: Padding4,
  options: PadImageFilterOptions = {},
): ImageDataLike => {
  const dest = createImageData(
    padL + source.width + padR,
    padT + source.height + padB,
  );

  if (options.backgroundColor) {
    const rgba = new Uint32Array(
      dest.data.buffer,
      dest.data.byteOffset,
      dest.data.byteLength / 4,
    );
    rgba.fill(options.backgroundColor);
  }

  const sStride = source.width * 4;
  const dStride = dest.width * 4;

  for (let y = 0; y < source.height; y++) {
    const srcIdx = y * sStride;
    const row = source.data.subarray(srcIdx, srcIdx + sStride);

    const dstIdx = (y + padT) * dStride + padL * 4;
    dest.data.set(row, dstIdx);
  }

  return dest;
};

export const padImageFilter = (
  n: Padding,
  options?: PadImageFilterOptions,
): ImageFilter => {
  const pad = toPadding4(n);
  return (source: ImageDataLike): ImageDataLike =>
    padImageDataFilter(source, pad, options);
};
