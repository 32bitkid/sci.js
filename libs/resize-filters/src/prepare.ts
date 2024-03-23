import {
  type ImageDataLike,
  type IndexedPixelData,
  createImageData,
  createIndexedPixelData,
  isIndexedPixelData,
} from '@4bitlabs/image';

export interface ScaleState<T extends ImageDataLike | IndexedPixelData> {
  source: T;
  dest: T;

  sourceRGB: Uint32Array | Uint8ClampedArray;
  destRGB: Uint32Array | Uint8ClampedArray;
}

export function prepareScale<T extends ImageDataLike | IndexedPixelData>(
  source: T,
  [sx, sy]: [number, number],
  dest?: T,
): ScaleState<T> {
  dest =
    dest ??
    ((isIndexedPixelData(source)
      ? createIndexedPixelData(source.width * sx, source.height * sy)
      : createImageData(source.width * sx, source.height * sy)) as T);

  const sourceRGB = isIndexedPixelData(source)
    ? source.pixels
    : new Uint32Array(
        source.data.buffer,
        source.data.byteOffset,
        source.data.byteLength >>> 2,
      );

  const destRGB = isIndexedPixelData(dest)
    ? dest.pixels
    : new Uint32Array(
        dest.data.buffer,
        dest.data.byteOffset,
        dest.data.byteLength >>> 2,
      );

  return {
    source,
    dest,

    sourceRGB,
    destRGB,
  };
}
