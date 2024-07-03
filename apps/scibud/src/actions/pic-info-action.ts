import { Command } from 'commander';

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

  const compressionTypes: Record<'sci0' | 'sci01', Record<number, string>> = {
    sci0: {
      0: 'none',
      1: 'LZW',
      2: 'Huffman',
    },
    sci01: {
      0: 'none',
      1: 'Huffman',
      2: 'Comp3',
    },
  };

  console.log('');
  console.log(`PIC.${pic.toString(10).padStart(3, '0')}`);
  console.log(`Commands: ${picData.length.toLocaleString()}`);
  console.log(`Size: ${header.actualSize.toLocaleString()} bytes`);

  console.log('\n\u{1F5DC} Compression:');
  console.log(
    `Type: ${compressionTypes[engine][header.compression]} (${header.compression})`,
  );
  if (header.compression !== 0) {
    console.log(`Size: ${(header.packedSize - 4).toLocaleString()} bytes`);
    console.log(
      `Ratio: ${((160 * 190) / (header.packedSize - 4)).toFixed(1)}\u22361 | \u{1F4C9} \u{2212}${((1 - (header.packedSize - 4) / (160 * 190)) * 100).toFixed(1)}%`,
    );
  }

  const modeTotals = picData.reduce<Record<string, number>>((map, [mode]) => {
    map[mode] = (map[mode] ?? 0) + 1;
    return map;
  }, {});

  console.log('\n\u{1F9F0} Breakdown:');
  const toolIcons: Record<string, string> = {
    pline: '\u{1F4C8}',
    brush: '\u{1F58C}',
    fill: '\u{1FAA3}',
    set_palette: '\u{1F3A8}',
  };

  Object.entries(modeTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([key, val]) => ({
      tool: key.toLowerCase(),
      count: val.toLocaleString(),
      percent: `${((val / picData.length) * 100).toFixed(0)}%`,
    }))
    .forEach(({ tool, count, percent }) => {
      console.log(`${toolIcons[tool]} ${tool}: ${count} (${percent})`);
    });
}
