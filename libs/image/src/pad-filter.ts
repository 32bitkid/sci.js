import {
  type PixelFilter,
  type ImageFilter,
  type GenericFilter,
} from './image-filter';
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
  left: number,
  bottom: number,
  right: number,
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
  [nt, nl, nb, nr]: PadQuad,
): IndexedPixelData => {
  const dest = createIndexedPixelData(
    nl + source.width + nr,
    nt + source.height + nb,
    { keyColor: source.keyColor },
  );

  for (let y = 0; y < source.height; y++)
    // TODO copy an entire row at time
    for (let x = 0; x < source.width; x++) {
      dest.pixels[(y + nt) * dest.width + x + nl] =
        source.pixels[y * source.width + x];
    }
  return dest;
};

const imagePad = (
  source: ImageDataLike,
  [nt, nl, nb, nr]: PadQuad,
): ImageDataLike => {
  const dest = createImageData(nl + source.width + nr, nt + source.height + nb);

  const sourcePixels = new Uint32Array(
    source.data,
    source.data.byteOffset,
    source.data.byteLength / 4,
  );
  const destPixels = new Uint32Array(
    dest.data,
    dest.data.byteOffset,
    dest.data.byteLength / 4,
  );

  for (let y = 0; y < source.height; y++)
    // TODO copy an entire row at time
    for (let x = 0; x < source.width; x++) {
      destPixels[(y + nt) * dest.width + x + nl] =
        sourcePixels[y * source.width + x];
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
