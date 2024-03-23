import sharp, { type Sharp } from 'sharp';

import { renderPic, type DrawCommand } from '@4bitlabs/sci0';
import { renderPixelData } from '@4bitlabs/image';
import { createPicPipeline } from './create-pic-pipeline';
import { RenderPicOptions } from '../models/render-pic-options';

const FORMAT_MAPPING = {
  png: (source: Sharp) => source.png().toBuffer(),
  jpeg: (source: Sharp) => source.jpeg().toBuffer(),
  webp: (source: Sharp) => source.webp().toBuffer(),
  raw: (source: Sharp) => source.raw().toBuffer(),
};

export async function renderPicWorker(
  outfile: string,
  picData: DrawCommand[],
  options: RenderPicOptions,
) {
  const { visible } = renderPic(picData, { forcePal: options.forcePal });

  const pipeline = createPicPipeline(options);
  const { data, width, height } = renderPixelData(visible, pipeline);
  const image = sharp(data, { raw: { width, height, channels: 4 } });

  if (outfile === '-') {
    process.stdout.write(await FORMAT_MAPPING[options.format](image));
  } else {
    await image.toFile(outfile);
  }
}
