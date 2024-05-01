import { type Command } from 'commander';
import sharp, { type Sharp } from 'sharp';

import { decompress, parsePic, renderPic } from '@4bitlabs/sci0';
import { renderPixelData } from '@4bitlabs/image';
import { picMatcher } from '../helpers/resource-matchers';
import { loadContentFromMap } from './load-content-from-map';
import {
  RenderPicOptions,
  RenderPipelineOptions,
} from '../models/render-pic-options';
import { pickRenderOptions } from './pick-render-options';
import { getRootOptions } from './get-root-options';
import { createPicPipeline } from '../helpers/create-pic-pipeline';

const FORMAT_MAPPING = {
  png: (source: Sharp) => source.png().toBuffer(),
  jpg: (source: Sharp) => source.jpeg().toBuffer(),
  webp: (source: Sharp) => source.webp().toBuffer(),
  raw: (source: Sharp) => source.raw().toBuffer(),
};

interface PicRenderActionOptions {
  readonly output: string;
}

export async function picRenderAction(
  id: number,
  options: PicRenderActionOptions & RenderPicOptions & RenderPipelineOptions,
  cmd: Command,
) {
  const { root, engine } = getRootOptions(cmd);
  const [picOptions, renderOptions] = pickRenderOptions(options);
  const {
    format,
    forcePal,
    layer,
    output: outfile = `pic.${id.toString(10).padStart(3, '0')}.${format}`,
  } = picOptions;

  const [header, compressed] = await loadContentFromMap(root, picMatcher(id));
  const picData = decompress(engine, header.compression, compressed);
  const pic = parsePic(picData);

  const layers = renderPic(pic, { forcePal: forcePal });

  const pipeline = createPicPipeline(layer, renderOptions);
  const { data, width, height } = renderPixelData(layers[layer], pipeline);

  const image = sharp(data, { raw: { width, height, channels: 4 } });

  if (outfile === '-') {
    process.stdout.write(await FORMAT_MAPPING[format](image));
  } else {
    await image.toFile(outfile);
  }
}
