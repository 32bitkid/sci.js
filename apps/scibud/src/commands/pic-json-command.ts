import type { Command } from 'commander';

import { decompress, parsePic } from '@4bitlabs/sci0';
import { cmdIntParser } from './cmd-int-parser.js';
import { getRootOptions } from '../actions/get-root-options.js';
import { loadContentFromMap } from '../actions/load-content-from-map.js';
import { picMatcher } from '../helpers/resource-matchers.js';

export function picJSONCommand(cmd: Command): Command {
  cmd
    .command('json', { hidden: true })
    .argument('<num>', 'Picture resource number', cmdIntParser)
    .action(async (id: number, _: unknown, command: Command) => {
      const { root, engine } = getRootOptions(command);

      const [header, compressed] = await loadContentFromMap(
        root,
        picMatcher(id),
      );
      const picData = decompress(engine, header.compression, compressed);
      const pic = parsePic(picData);
      console.log(JSON.stringify(pic));
    })
    .description('dump the pic data as JSON');

  return cmd;
}
