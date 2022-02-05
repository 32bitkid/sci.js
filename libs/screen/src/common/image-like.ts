export interface ImageLike {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray;
}

export type ImageFilter = (source: ImageLike) => ImageLike;
