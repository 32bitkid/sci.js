import type { ImageDataLike } from './image-data-like.js';

export interface CrtUpdateOptions {
  Fx?: number;
  Fy?: number;
  S?: number;
  hBlur?: number;
  grain?: number;
  vignette?: number;
  scanLines?: boolean;
}

export type CrtUpdateFn = (
  imageData: ImageDataLike,
  options?: CrtUpdateOptions,
) => void;
