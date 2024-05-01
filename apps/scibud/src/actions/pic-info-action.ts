import { Command } from 'commander';
import columnify from 'columnify';

import {
  decompress,
  getPayloadLength,
  parseAllMappings,
  parseHeaderFrom,
  parsePic,
} from '@4bitlabs/sci0';
import { picMatcher } from '../helpers/resource-matchers';
import { readFile } from '../helpers/read-file';
import { getRootOptions } from './get-root-options';

export async function picInfoAction(pic: number, _: unknown, cmd: Command) {
  const { root, engine } = getRootOptions(cmd);

  console.log(`Searching for pic #${pic}…`);

  const [mapping] = parseAllMappings(await readFile(root, 'RESOURCE.MAP'));

  const found = mapping.find(picMatcher(pic));
  if (!found) {
    cmd.error(`Error: pic #${pic} not found!`, { code: 'NOT_FOUND' });
  }

  const { offset, file } = found;
  const resPart = file.toString().padStart(3, '0');

  console.log(
    `Located in "RESOURCE.${resPart}" at offset ${offset.toLocaleString()}`,
  );

  const resFile = await readFile(root, `RESOURCE.${resPart}`);

  const headerContent = resFile.subarray(offset, offset + 8);
  const header = parseHeaderFrom(headerContent);

  const start = offset + 8;
  const end = start + getPayloadLength(header);
  const picData = parsePic(
    decompress(engine, header.compression, resFile.subarray(start, end)),
  );

  console.log('');
  const data = {
    Pic: `#${pic}`,
    Compression: header.compression,
    Size: header.actualSize.toLocaleString(),
    'Size (Compressed)': header.packedSize.toLocaleString(),
    Commands: picData.length.toLocaleString(),
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

  const modeTotals = picData.reduce<Record<string, number>>((map, [mode]) => {
    map[mode] = (map[mode] ?? 0) + 1;
    return map;
  }, {});

  console.log('\nBreakdown:');
  console.log(
    columnify(
      [
        ...Object.entries(modeTotals)
          .sort((a, b) => b[1] - a[1])
          .map(([key, val]) => ({
            tool: key.toLowerCase(),
            count: val.toLocaleString(),
            percent: `${((val / picData.length) * 100).toFixed(0)}%`,
          })),
      ],
      {
        columns: ['tool', 'count', 'percent'],
        showHeaders: false,
        columnSplitter: ' | ',
        config: {
          tool: { align: 'left' },
          count: {
            align: 'right',
          },
          percent: {
            align: 'right',
          },
        },
      },
    ),
  );
}
