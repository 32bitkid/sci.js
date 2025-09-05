import type { IndexedPixelData } from './indexed-pixel-data';
import type { PaletteFilter, ImageFilter, PixelFilter } from './image-filter';
import type { ImageDataLike } from './image-data-like';

export interface RenderPipeline {
  pre?: (PixelFilter | false | undefined)[];
  render: PaletteFilter;
  post?: (ImageFilter | false | undefined)[];
}

/**
 * You can also execute more complex transformation pipelines with {@link renderPixelData}, which will convert a
 * palletized {@link IndexedPixelData} into a true-color {@link ImageDataLike}.
 *
 * @param source
 * @param pipeline
 *
 * @example
 *
 * ```ts
 * import { Palette, Dithers } from '@4bitlabs/color';
 * import { scale5x6 } from '@4bitlabs/blur-filters';
 * import { hBoxBlur } from '@4bitlabs/blur-filters';
 * import {
 *   renderPixelData,
 *   createDitherFilter,
 *   type RenderPipeline,
 * } from '@4bitlabs/image';
 *
 * const imageData = renderPixelData(visual, {
 *   // First, scale the image using the scale5x6 algorithm
 *   pre: [scale5x6],
 *   // Dither with CGA pairs, using a 5 by 6 pattern
 *   dither: createDitherFilter(Dithers.CGA, [5, 6]),
 *   // Finally, apply a horizontal box blur to the image
 *   post: [hBoxBlur(3)], //
 * });
 * ```
 */
export function renderPixelData(
  source: IndexedPixelData,
  pipeline: RenderPipeline,
): ImageDataLike {
  const { pre = [], render, post = [] } = pipeline;
  const img1 = pre.reduce((it, filter) => (filter ? filter(it) : it), source);
  const img2 = render(img1);
  return post.reduce((it, filter) => (filter ? filter(it) : it), img2);
}
