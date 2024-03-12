import { program } from 'commander';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { picMatcher } from '../helpers/resource-matchers';
import {
  getPayloadLength,
  parseAllMappings,
  parseHeaderFrom,
} from '@4bitlabs/sci0';

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
