import { type Command } from 'commander';

import { decompress, Pic } from '@4bitlabs/sci0';
import { picMatcher } from '../helpers/resource-matchers';
import { renderPicWorker } from '../workers/render-pic-worker';
import { loadContentFromMap } from './load-content-from-map';
import { RenderPicOptions } from '../models/render-pic-options';
import { pickRenderOptions } from './pick-render-options';

interface PicRenderActionOptions extends RenderPicOptions {
  readonly output: string;
}

export async function picRenderAction(
  id: number,
  options: PicRenderActionOptions,
  cmd: Command,
) {
  const [
    { output = `pic.${id.toString(10).padStart(3, '0')}.png` },
    renderOptions,
  ] = pickRenderOptions(options);

  const { root, engine } = cmd.optsWithGlobals();

  const [header, compressed] = await loadContentFromMap(root, picMatcher(id));
  const picData = decompress(engine, header.compression, compressed);
  const pic = Pic.parseFrom(picData);

  // render single image
  await renderPicWorker(output, pic, renderOptions);
}
