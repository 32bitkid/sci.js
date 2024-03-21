import { join } from 'path';

import { Presets, SingleBar } from 'cli-progress';
import { program } from 'commander';

import { decompress, Pic } from '@4bitlabs/sci0';
import { picMatcher } from '../helpers/resource-matchers';
import workers from '../workers';
import { renderPicWorker } from '../workers/render-pic-worker';
import { loadContentFromMap } from './load-content-from-map';

const REPEAT_LAST = 4 * 30;

interface RenderPicOptions {
  readonly outdir: string;
  readonly filename: string;
  readonly all: boolean;
  readonly preRoll: number | false;
}

const picRender = async (pic: number, options: RenderPicOptions) => {
  const {
    outdir,
    filename = `pic.${pic.toString(10).padStart(3, '0')}`,
    preRoll,
    all,
  } = options;

  const { root, engine } = program.opts();
  const progress = new SingleBar(Presets.shades_grey);

  const [header, compressed] = await loadContentFromMap(root, picMatcher(pic));
  const data = decompress(engine, header.compression, compressed);
  const picData = Pic.parseFrom(data);

  if (!all) {
    // render single image
    await renderPicWorker(join(outdir, `${filename}.png`), picData, 0, 0);
    return;
  }

  progress.start(picData.length, 0);
  const done = Array(picData.length)
    .fill(null)
    .map((_, idx, arr) => {
      const isLast = idx === arr.length - 1;

      const frameNum = preRoll ? (isLast ? 0 : idx + REPEAT_LAST) : idx;
      const repeat = preRoll && isLast ? REPEAT_LAST - 1 : 0;

      return workers
        .exec('renderPic', [
          join(outdir, `${filename}.%d.png`),
          picData.slice(0, idx),
          frameNum,
          repeat,
        ])
        .then(() => progress.increment());
    });

  await Promise.all(done);
  progress.stop();
};

export default picRender;
