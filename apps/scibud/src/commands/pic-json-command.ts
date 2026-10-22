import { buffer } from 'node:stream/consumers';
import type { Command } from 'commander';
import { decompress, encodePic, parsePic, ResourceTypes } from '@4bitlabs/sci0';
import { PicSchema } from '@4bitlabs/sci0-zod';

import { cmdIntParser } from './cmd-int-parser.js';
import { getRootOptions } from '../actions/get-root-options.js';
import { loadContentFromMap } from '../actions/load-content-from-map.js';
import { picMatcher } from '../helpers/resource-matchers.js';
import { readFileStream } from '../helpers/read-file.js';

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
      console.log(JSON.stringify(PicSchema.encode(pic)));
    })
    .description('dump the pic data as JSON');

  cmd
    .command('from-json', { hidden: true })
    .argument('<file>')
    .action(async (file: string, _: unknown, command: Command) => {
      const { root } = getRootOptions(command);
      const stream = await readFileStream(root, file);
      const content = await buffer(stream);
      const rawPic = JSON.parse(content.toString('utf-8'));
      const result = PicSchema.safeParse(rawPic);
      if (result.success) {
        const header = Uint8Array.of(ResourceTypes.PIC_TYPE | 0x80, 0x00);
        process.stdout.write(header);
        process.stdout.write(encodePic(result.data));
      } else {
        console.error('source is not valid');
        process.exit(1);
      }
    });

  return cmd;
}
