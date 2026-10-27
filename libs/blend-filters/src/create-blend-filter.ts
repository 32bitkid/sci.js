import type { ImageDataLike } from '@4bitlabs/image';
import type { BlendMode } from './blend-modes.js';
import { blend } from './blend.js';

export type BlendFilter = (a: ImageDataLike, b: ImageDataLike) => ImageDataLike;

export const createBlendFilter =
  (mode: BlendMode): BlendFilter =>
  (a, b) =>
    blend(a, b, mode);
