import { FILL_CHUNK, MAX_FILL } from './fill-chunks';

export const INDEXED: unique symbol = Symbol('INDEXED');

export interface IndexedPixelData {
  readonly pixels: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
  readonly keyColor?: number;
  readonly [INDEXED]: typeof INDEXED;
}

interface CreateIndexPixelDataOptions {
  keyColor?: number;
}

export function createIndexedPixelData(
  width: number,
  height: number,
  options: CreateIndexPixelDataOptions = {},
): IndexedPixelData {
  width >>>= 0;
  height >>>= 0;

  const pixels = new Uint8ClampedArray(width * height);

  const { keyColor } = options;
  if (keyColor && keyColor >= 0 && keyColor < 256) {
    const fill = FILL_CHUNK.subarray(keyColor * 320);
    for (let i = 0; i < pixels.length; i += MAX_FILL)
      pixels.set(fill.subarray(0, Math.min(MAX_FILL, pixels.length - i)), i);
  }

  return {
    [INDEXED]: INDEXED,
    keyColor,
    pixels,
    width,
    height,
  };
}

export function isIndexedPixelData(it: unknown): it is IndexedPixelData {
  return (
    typeof it === 'object' &&
    it !== null &&
    INDEXED in it &&
    it[INDEXED] === INDEXED
  );
}
