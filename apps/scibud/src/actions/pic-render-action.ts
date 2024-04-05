import { type Command } from 'commander';

import { decompress, parsePic } from '@4bitlabs/sci0';
import { picMatcher } from '../helpers/resource-matchers';
import { renderPicWorker } from '../workers/render-pic-worker';
import { loadContentFromMap } from './load-content-from-map';
import {
  RenderPicOptions,
  RenderPipelineOptions,
} from '../models/render-pic-options';
import { pickRenderOptions } from './pick-render-options';
import { getRootOptions } from './get-root-options';

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
    output = `pic.${id.toString(10).padStart(3, '0')}.${format}`,
  } = picOptions;

  const [header, compressed] = await loadContentFromMap(root, picMatcher(id));
  const picData = decompress(engine, header.compression, compressed);
  const pic = parsePic(picData);

  // render single image
  await renderPicWorker(
    output,
    pic,
    picOptions.layer,
    forcePal,
    format,
    renderOptions,
  );
}
