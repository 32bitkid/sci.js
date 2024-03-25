import { Command } from 'commander';
import columnify from 'columnify';

import { parseAllMappings, parseHeaderFrom } from '@4bitlabs/sci0';
import { picMatcher } from '../helpers/resource-matchers';
import { readFile } from '../helpers/read-file';

export async function picInfo(pic: number, _: unknown, cmd: Command) {
  const { root } = cmd.optsWithGlobals();

  console.log(`Searching for pic #${pic}…`);

  const [mapping] = parseAllMappings(await readFile(root, 'RESOURCE.MAP'));

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

  const resFile = await readFile(root, resPart);

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
