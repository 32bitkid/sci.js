import { type Command } from 'commander';

import { decompress, Pic } from '@4bitlabs/sci0';
import { picMatcher } from '../helpers/resource-matchers';
import { renderPicWorker } from '../workers/render-pic-worker';
import { loadContentFromMap } from './load-content-from-map';
import { RenderOptions } from '../models/render-options';
import { pickRenderOptions } from './pick-render-options';

interface RenderPicOptions extends RenderOptions {
  readonly output: string;
}

const picRender = async (
  pic: number,
  options: RenderPicOptions,
  cmd: Command,
) => {
  const [
    { output = `pic.${pic.toString(10).padStart(3, '0')}.png` },
    renderOptions,
  ] = pickRenderOptions(options);

  const { root, engine } = cmd.optsWithGlobals();

  const [header, compressed] = await loadContentFromMap(root, picMatcher(pic));
  const data = decompress(engine, header.compression, compressed);
  const picData = Pic.parseFrom(data);

  // render single image
  await renderPicWorker(output, picData, renderOptions);
};

export default picRender;
