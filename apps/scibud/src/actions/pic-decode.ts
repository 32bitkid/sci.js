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

const REPEAT_LAST = 4 * 30;

interface RenderPicOptions {
  readonly outdir: string;
  readonly filename: string;
  readonly all: boolean;
  readonly preRoll: number | false;
}

const picDecode = async (pic: number) => {
  const { root } = program.opts();

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
  process.stdout.write(compressed);
};

export default picDecode;
