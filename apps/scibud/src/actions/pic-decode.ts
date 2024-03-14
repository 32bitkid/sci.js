import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { program } from 'commander';

import {
  decompress,
  getPayloadLength,
  parseAllMappings,
  parseHeaderFrom,
} from '@4bitlabs/sci0';
import { picMatcher } from '../helpers/resource-matchers';

interface PicDecodeOptions {
  decompress: boolean;
}

const picDecode = async (pic: number, options: PicDecodeOptions) => {
  const { root, engine } = program.opts();

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
  let data: Uint8Array = resFile.subarray(start, end);
  if (options.decompress) {
    data = decompress(engine, header.compression, data);
  }
  process.stdout.write(data);
};

export default picDecode;
