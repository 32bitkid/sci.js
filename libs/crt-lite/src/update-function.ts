import { ImageDataLike } from './image-data-like';

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
