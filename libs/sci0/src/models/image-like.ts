export interface ImageDataLike {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray;
}

export type ImageFilter = (source: ImageDataLike) => ImageDataLike;
