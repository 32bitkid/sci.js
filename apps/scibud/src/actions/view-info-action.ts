import { Command } from 'commander';
import columnify from 'columnify';

import {
  decompress,
  parseAllMappings,
  parseHeaderWithPayload,
  parseView,
} from '@4bitlabs/sci0';
import { viewMatcher } from '../helpers/resource-matchers';
import { readFile } from '../helpers/read-file';
import { getRootOptions } from './get-root-options';

export async function viewInfoAction(
  viewNum: number,
  _: unknown,
  cmd: Command,
) {
  const { root, engine } = getRootOptions(cmd);

  console.log(`Searching for view #${viewNum}…`);

  const [mapping] = parseAllMappings(await readFile(root, 'RESOURCE.MAP'));

  const found = mapping.find(viewMatcher(viewNum));
  if (!found) {
    cmd.error(`Error: view #${viewNum} not found!`, { code: 'NOT_FOUND' });
  }

  const { offset, file } = found;
  const resPart = file.toString().padStart(3, '0');

  console.log(
    `Located in "RESOURCE.${resPart}" at offset ${offset.toLocaleString()}`,
  );

  const resFile = await readFile(root, `RESOURCE.${resPart}`);
  const [header, payload] = parseHeaderWithPayload(resFile, offset);
  const viewData = parseView(decompress(engine, header.compression, payload));

  const data = {
    View: `#${viewNum}`,
    Compression: header.compression,
    Size: header.actualSize.toLocaleString(),
    'Size (Compressed)': header.packedSize.toLocaleString(),
    Loops: viewData.length,
  };

  console.log('');
  console.log(
    columnify(data, {
      showHeaders: false,
      config: {
        key: { dataTransform: (it) => `${it}:` },
        value: { align: 'right' },
      },
    }),
  );

  const loopData = viewData.map((loop, i) => ({
    '#': i,
    Size: `${loop.bounds.height} x ${loop.bounds.width}`,
    Frames: loop.frames.length.toLocaleString(),
    Mirrored: loop.isMirrored ? 'Y' : 'N',
  }));

  console.log('');
  console.log(
    columnify(loopData, {
      columnSplitter: ' | ',
      config: {
        '#': { align: 'center', minWidth: 3, showHeaders: false },
        Size: { align: 'center', minWidth: 9 },
        Frames: { align: 'right' },
        Mirrored: { align: 'center' },
      },
    }),
  );
}
