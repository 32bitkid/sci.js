import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { program } from 'commander';

import {
  getResourceNumber,
  getResourceTypeStr,
  parseAllMappings,
} from '@4bitlabs/sci0';

const picList = async () => {
  const { root } = program.opts();

  const files = await readdir(root);

  const mapFile = files.find((fn) => /^resource.map$/i.test(fn))!;
  const [mapping] = parseAllMappings(await readFile(join(root, mapFile)));

  const picSet = new Set<number>(
    mapping
      .filter((it) => getResourceTypeStr(it.id) === 'Pic')
      .map((it) => getResourceNumber(it.id)),
  );

  [...picSet.values()]
    .sort((a, b) => a - b)
    .forEach((it) => console.log('%s', it));
};

export default picList;
