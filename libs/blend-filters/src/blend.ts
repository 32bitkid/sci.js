import { type ImageDataLike, createImageData, asRGBA } from '@4bitlabs/image';
import type { BlendMode } from './blend-modes.js';

/**
 * Blend two images together with the `blendFn` algorithm. Both images must be of the same size. If `out` is omitted,
 * a new image will be created, with the same dimensions of `a` and `b`.
 *
 * @param blendFn the desired blend mode
 * @param a Base-layer image
 * @param b Blend-layer image
 * @param out Output image
 * @returns Output image
 */
export const blend = (
  blendFn: BlendMode,
  a: ImageDataLike,
  b: ImageDataLike,
  out: ImageDataLike = createImageData(a.width, b.height),
): ImageDataLike => {
  if (a.width !== b.width || a.height !== b.height)
    throw new Error('images must be the same size');

  const aRGBA = asRGBA(a);
  const bRGBA = asRGBA(b);

  const blendRGBA = asRGBA(out);

  for (let i = 0; i < a.width * a.height; i++)
    blendRGBA[i] = blendFn(aRGBA[i], bRGBA[i]);

  return out;
};
