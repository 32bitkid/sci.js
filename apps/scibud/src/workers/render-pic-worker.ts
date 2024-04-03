import sharp, { type Sharp } from 'sharp';

import { renderPic, type DrawCommand } from '@4bitlabs/sci0';
import { renderPixelData } from '@4bitlabs/image';
import { createPicPipeline } from './create-pic-pipeline';
import { RenderPipelineOptions } from '../models/render-pic-options';

const FORMAT_MAPPING = {
  png: (source: Sharp) => source.png().toBuffer(),
  jpg: (source: Sharp) => source.jpeg().toBuffer(),
  webp: (source: Sharp) => source.webp().toBuffer(),
  raw: (source: Sharp) => source.raw().toBuffer(),
};

export async function renderPicWorker(
  outfile: string,
  picData: DrawCommand[],
  layer: 'visible' | 'priority' | 'control',
  forcePal: 0 | 1 | 2 | 3 | undefined,
  format: 'png' | 'jpg' | 'webp' | 'raw',
  options: RenderPipelineOptions,
) {
  const pixelData = renderPic(picData, { forcePal: forcePal })[layer];

  const pipeline = createPicPipeline(layer, options);
  const { data, width, height } = renderPixelData(pixelData, pipeline);
  const image = sharp(data, { raw: { width, height, channels: 4 } });

  if (outfile === '-') {
    process.stdout.write(await FORMAT_MAPPING[format](image));
  } else {
    await image.toFile(outfile);
  }
}
