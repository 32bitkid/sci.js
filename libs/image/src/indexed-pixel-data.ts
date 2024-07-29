export interface IndexedPixelData {
  readonly pixels: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
  readonly keyColor?: number;
}

export interface CreateIndexPixelDataOptions {
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
  if (keyColor !== undefined) pixels.fill(keyColor);

  return {
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
    'pixels' in it &&
    it.pixels instanceof Uint8ClampedArray &&
    'width' in it &&
    typeof it.width === 'number' &&
    'height' in it &&
    typeof it.height === 'number'
  );
}
