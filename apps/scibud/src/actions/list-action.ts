import { type Command } from 'commander';

import { getResourceNumber, parseAllMappings } from '@4bitlabs/sci0';
import { readFile } from '../helpers/read-file';
import { getRootOptions } from './get-root-options';

export const listActionFor = (matchFn: (id: number) => boolean) =>
  async function listAction(_: unknown, cmd: Command) {
    const { root } = getRootOptions(cmd);

    const [mapping] = parseAllMappings(await readFile(root, 'RESOURCE.MAP'));

    const picSet = new Set<number>(
      mapping
        .filter((it) => matchFn(it.id))
        .map((it) => getResourceNumber(it.id)),
    );

    [...picSet.values()]
      .sort((a, b) => a - b)
      .forEach((it) => {
        console.log(it.toString(10));
      });
  };
