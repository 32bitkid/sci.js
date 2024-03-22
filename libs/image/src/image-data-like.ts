export interface ImageDataLike {
  readonly data: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
}

export function createImageData(width: number, height: number): ImageDataLike {
  if (typeof ImageData !== 'undefined') return new ImageData(width, height);

  return {
    data: new Uint8ClampedArray(width * height * 4),
    width,
    height,
  };
}
