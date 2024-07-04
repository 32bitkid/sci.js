import sharp, { type Sharp } from 'sharp';

import { type FontFace } from '@4bitlabs/sci0';
import { type IndexedPixelData, renderPixelData } from '@4bitlabs/image';
import { createPicPipeline } from '../helpers/create-pic-pipeline';
import { RenderPipelineOptions } from '../models/render-pic-options';
import { menuFilter } from '../helpers/menu-filter';

const FORMAT_MAPPING = {
  png: (source: Sharp) => source.png().toBuffer(),
  jpg: (source: Sharp) => source.jpeg().toBuffer(),
  webp: (source: Sharp) => source.webp().toBuffer(),
  raw: (source: Sharp) => source.raw().toBuffer(),
};

export async function renderPicWorker(
  outfile: string,
  layerData: IndexedPixelData,
  layer: 'visible' | 'priority' | 'control',
  format: 'png' | 'jpg' | 'webp' | 'raw',
  options: RenderPipelineOptions,
  message?: { font: FontFace; left: string; right: string },
) {
  const pipeline = createPicPipeline(layer, options);
  const { data, width, height } = renderPixelData(layerData, {
    pre: [message && menuFilter(1, 1, message), ...(pipeline.pre ?? [])],
    dither: pipeline.dither,
    post: pipeline.post,
  });
  const image = sharp(data, { raw: { width, height, channels: 4 } });
  if (outfile === '-') {
    process.stdout.write(await FORMAT_MAPPING[format](image));
  } else {
    await image.toFile(outfile);
  }
}
