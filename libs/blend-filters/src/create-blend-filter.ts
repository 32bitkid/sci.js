import type { ImageDataLike } from '@4bitlabs/image';
import type { BlendMode } from './blend-modes.js';
import { blend } from './blend.js';

/**
 * Blend two images into a new image. Both images must be of the same size. If `out` is omitted, a new image will
 * be created, with the same dimensions of `a` and `b`.
 *
 * @param a Base-layer image
 * @param b Blend-layer image
 * @param out Output image.
 * @returns Output image
 */
export type BlendFilter = (
  a: ImageDataLike,
  b: ImageDataLike,
  out?: ImageDataLike,
) => ImageDataLike;

export const createBlendFilter =
  (mode: BlendMode): BlendFilter =>
  (a, b, out) =>
    blend(mode, a, b, out);
