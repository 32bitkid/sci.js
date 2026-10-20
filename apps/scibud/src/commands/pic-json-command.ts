import type { Command } from 'commander';

import { decompress, encodePic, parsePic, ResourceTypes } from '@4bitlabs/sci0';
import { cmdIntParser } from './cmd-int-parser.js';
import { getRootOptions } from '../actions/get-root-options.js';
import { loadContentFromMap } from '../actions/load-content-from-map.js';
import { picMatcher } from '../helpers/resource-matchers.js';
import { readFile } from '../helpers/read-file.js';

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

  cmd
    .command('from-json', { hidden: true })
    .argument('<file>')
    .action(async (file: string, _: unknown, command: Command) => {
      const { root } = getRootOptions(command);
      const content = await readFile(root, file);
      const pic = JSON.parse(content.toString('utf-8'));
      process.stdout.write(Uint8Array.of(ResourceTypes.PIC_TYPE | 0x80, 0x00));
      process.stdout.write(encodePic(pic));
    });

  return cmd;
}
