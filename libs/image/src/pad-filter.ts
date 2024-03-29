import { type GenericFilter } from './image-filter';
import {
  type IndexedPixelData,
  createIndexedPixelData,
  isIndexedPixelData,
} from './indexed-pixel-data';
import { createImageData, ImageDataLike } from './image-data-like';

export type PadSingle = number;
export type PadDouble = [vertical: number, horizontal: number];
export type PadTriple = [top: number, h: number, bottom: number];
export type PadQuad = [
  top: number,
  right: number,
  bottom: number,
  left: number,
];

export type Padding = PadSingle | PadDouble | PadTriple | PadQuad;

const getPadding4 = (pad: Padding): PadQuad => {
  if (typeof pad === 'number') return [pad, pad, pad, pad];
  const [a, b] = pad;
  if (pad.length === 2) return [a, b, a, b];
  const [, , c] = pad;
  if (pad.length === 3) return [a, b, c, b];
  return pad;
};

const indexedPad = (
  source: IndexedPixelData,
  [padT, padR, padB, padL]: PadQuad,
): IndexedPixelData => {
  const dest = createIndexedPixelData(
    padL + source.width + padR,
    padT + source.height + padB,
    { keyColor: source.keyColor },
  );

  for (let y = 0; y < source.height; y++) {
    const srcIdx = y * source.width;
    const dstIdx = (y + padT) * dest.width + padL;
    const row = source.pixels.subarray(srcIdx, srcIdx + source.width);
    dest.pixels.set(row, dstIdx);
  }
  return dest;
};

const imagePad = (
  source: ImageDataLike,
  [padT, padR, padB, padL]: PadQuad,
): ImageDataLike => {
  const dest = createImageData(
    padL + source.width + padR,
    padT + source.height + padB,
  );

  const sourcePixels = new Uint32Array(
    source.data.buffer,
    source.data.byteOffset,
    source.data.byteLength / 4,
  );
  const destPixels = new Uint32Array(
    dest.data.buffer,
    dest.data.byteOffset,
    dest.data.byteLength / 4,
  );

  for (let y = 0; y < source.height; y++) {
    const srcIdx = y * source.width;
    const dstIdx = (y + padT) * dest.width + padL;
    const row = sourcePixels.subarray(srcIdx, srcIdx + source.width);
    destPixels.set(row, dstIdx);
  }

  return dest;
};

export const padFilter = (n: Padding): GenericFilter => {
  const pad = getPadding4(n);
  return <T extends ImageDataLike | IndexedPixelData>(source: T): T =>
    (isIndexedPixelData(source)
      ? indexedPad(source, pad)
      : imagePad(source, pad)) as T;
};
