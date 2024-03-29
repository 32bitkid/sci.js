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

  if (options.keyColor) {
    for (let i = 0; i < pixels.length; i++) pixels[i] = options.keyColor;
  }

  return {
    [INDEXED]: INDEXED,
    pixels,
    width,
    height,
    ...options,
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
