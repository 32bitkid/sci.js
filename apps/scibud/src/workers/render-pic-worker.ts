import sharp, { type Sharp } from 'sharp';

import { createPipeline } from './create-pipeline';
import { RenderOptions } from '../models/render-options';
import { renderPic, type DrawCommand } from '@4bitlabs/sci0';

const FORMAT_MAPPING = {
  png: (source: Sharp) => source.png().toBuffer(),
  jpeg: (source: Sharp) => source.jpeg().toBuffer(),
  webp: (source: Sharp) => source.webp().toBuffer(),
  raw: (source: Sharp) => source.raw().toBuffer(),
};

export async function renderPicWorker(
  outfile: string,
  picData: DrawCommand[],
  options: RenderOptions,
) {
  const { visible } = renderPic(picData, {
    forcePal: parseInt(options.forcePal, 10) as 0 | 1 | 2 | 3,
    pipeline: createPipeline(options),
  });

  const { data, width, height } = visible;
  const image = sharp(data, { raw: { width, height, channels: 4 } });

  if (outfile === '-') {
    process.stdout.write(await FORMAT_MAPPING[options.format](image));
  } else {
    await image.toFile(outfile);
  }
}
