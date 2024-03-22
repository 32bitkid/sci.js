import { IndexedPixelData } from './indexed-pixel-data';
import { PaletteFilter, ImageFilter, PixelFilter } from './image-filter';
import { ImageDataLike } from './image-data-like';

interface FilterPipeline {
  pre?: PixelFilter[];
  dither: PaletteFilter;
  post?: ImageFilter[];
}

export function renderPixelData(
  source: IndexedPixelData,
  pipeline: FilterPipeline,
): ImageDataLike {
  const { pre = [], dither, post = [] } = pipeline;
  const img1 = pre.reduce((it, filter) => filter(it), source);
  const img2 = dither(img1);
  return post.reduce((it, filter) => filter(it), img2);
}
