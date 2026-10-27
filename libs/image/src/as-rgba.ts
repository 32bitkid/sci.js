import type { ImageDataLike } from './image-data-like.js';

export const asRGBA = (img: ImageDataLike): Uint32Array =>
  new Uint32Array(
    img.data.buffer,
    img.data.byteOffset,
    img.data.byteLength / 4,
  );
