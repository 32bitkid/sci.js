import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { Command } from 'commander';
import columnify from 'columnify';

import { parseAllMappings, parseHeaderFrom } from '@4bitlabs/sci0';
import { picMatcher } from '../helpers/resource-matchers';

export async function picInfo(pic: number, _: unknown, cmd: Command) {
  const { root } = cmd.optsWithGlobals();

  const files = await readdir(root);

  console.log(`Searching for pic #${pic}…`);

  const mapFile = files.find((fn) => /^resource.map$/i.test(fn))!;
  const [mapping] = parseAllMappings(await readFile(join(root, mapFile)));

  const found = mapping.find(picMatcher(pic));
  if (!found) {
    console.error(`Pic #${pic} not found!`);
    process.exit(1);
  }
  const { offset, file } = found!;

  const resPart = file.toString().padStart(3, '0');

  console.log(
    `Located in "RESOURCE.${resPart}" at offset ${offset.toLocaleString()}`,
  );

  const resFn = files.find((fn) =>
    new RegExp(`^resource.${resPart}$`, 'i').test(fn),
  )!;

  const resFile = await readFile(join(root, resFn));

  const headerContent = resFile.subarray(offset, offset + 8);
  const header = parseHeaderFrom(headerContent);

  console.log('');
  const data = {
    'Pic #': pic,
    Compression: header.compression,
    Size: header.actualSize.toLocaleString(),
    'Size (Compressed)': header.packedSize.toLocaleString(),
    'EGA Compression Ratio': `${((160 * 190) / header.packedSize).toFixed(2)}∶1`,
  };
  console.log(
    columnify(data, {
      showHeaders: false,
      config: {
        key: { dataTransform: (it) => `${it}:` },
        value: { align: 'right' },
      },
    }),
  );
}
