import { program } from 'commander';
import { Presets, SingleBar } from 'cli-progress';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { picMatcher } from '../helpers/resource-matchers';
import {
  decompress,
  getPayloadLength,
  parseAllMappings,
  parseHeaderFrom,
  Pic,
} from '@4bitlabs/sci0';

import workers from '../workers';

const REPEAT_LAST = 4 * 60;

interface RenderPicOptions {
  readonly outdir: string;
  readonly filename: string;
  readonly all: boolean;
  readonly preRoll: number | false;
}

const renderPic = async (pic: number, options: RenderPicOptions) => {
  const {
    outdir,
    filename = `pic.${pic.toString(10).padStart(3, '0')}`,
    preRoll,
    all,
  } = options;

  const { root } = program.opts();
  const progress = new SingleBar(Presets.shades_grey);

  const files = await readdir(root);

  const mapFile = files.find((fn) => /^resource.map$/i.test(fn))!;
  const [mapping] = parseAllMappings(await readFile(join(root, mapFile)));
  const { offset, file } = mapping.find(picMatcher(pic))!;

  const resFn = files.find((fn) =>
    new RegExp(`^resource.${file.toString().padStart(3, '0')}$`, 'i').test(fn),
  )!;

  const resFile = await readFile(join(root, resFn));

  const headerContent = resFile.subarray(offset, offset + 8);
  const header = parseHeaderFrom(headerContent);
  const start = offset + 8;
  const end = start + getPayloadLength(header);
  const compressed = resFile.subarray(start, end);

  const data = decompress('sci0', header.compression, compressed);
  const picData = Pic.parseFrom(data);

  if (!all) {
    await workers.exec('renderPic', [
      join(outdir, `${filename}.png`),
      picData,
      0,
      0,
    ]);
  } else {
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
  }
};

export default renderPic;
