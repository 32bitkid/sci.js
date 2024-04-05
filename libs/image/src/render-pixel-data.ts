import { IndexedPixelData } from './indexed-pixel-data';
import { PaletteFilter, ImageFilter, PixelFilter } from './image-filter';
import { ImageDataLike } from './image-data-like';

export interface RenderPipeline {
  pre?: (PixelFilter | false | undefined)[];
  dither: PaletteFilter;
  post?: (ImageFilter | false | undefined)[];
}

export function renderPixelData(
  source: IndexedPixelData,
  pipeline: RenderPipeline,
): ImageDataLike {
  const { pre = [], dither, post = [] } = pipeline;
  const img1 = pre.reduce((it, filter) => (filter ? filter(it) : it), source);
  const img2 = dither(img1);
  return post.reduce((it, filter) => (filter ? filter(it) : it), img2);
}
