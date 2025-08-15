import sharp, { type Sharp } from 'sharp';

import type { FontFace } from '@4bitlabs/sci0';
import { type IndexedPixelData, renderPixelData } from '@4bitlabs/image';
import { menuTextFilter } from '@4bitlabs/sci0-renderer';
import { createPicPipeline } from '../helpers/create-pic-pipeline';
import type { RenderPipelineOptions } from '../models/render-pic-options';

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
    pre: [message && menuTextFilter(1, 1, message), ...(pipeline.pre ?? [])],
    render: pipeline.render,
    post: pipeline.post,
  });
  const image = sharp(data, { raw: { width, height, channels: 4 } });
  if (outfile === '-') {
    process.stdout.write(await FORMAT_MAPPING[format](image));
  } else {
    await image.toFile(outfile);
  }
}
