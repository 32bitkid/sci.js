import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { program } from 'commander';

import {
  getPayloadLength,
  parseAllMappings,
  parseHeaderFrom,
} from '@4bitlabs/sci0';
import { picMatcher } from '../helpers/resource-matchers';

const picDecode = async (pic: number) => {
  const { root } = program.opts();

  const files = await readdir(root);

  const mapFile = files.find((fn) => /^resource.map$/i.test(fn))!;
  const [mapping] = parseAllMappings(await readFile(join(root, mapFile)));
  const { offset, file } = mapping.find(picMatcher(pic))!;

  const resPart = file.toString().padStart(3, '0');

  const resFn = files.find((fn) =>
    new RegExp(`^resource.${resPart}$`, 'i').test(fn),
  )!;

  const resFile = await readFile(join(root, resFn));

  const headerContent = resFile.subarray(offset, offset + 8);
  const header = parseHeaderFrom(headerContent);

  console.log(`Resource File: ${resPart} at ${offset.toLocaleString()}`);
  console.log(`Compression: ${header.compression}`);
  console.log(
    `Size: ${header.actualSize.toLocaleString()} bytes (${header.actualSize.toLocaleString()} bytes compressed)`,
  );
};

export default picDecode;
