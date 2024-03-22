import { Command } from 'commander';

import * as Actions from '../actions';
import { cmdIntParser } from './cmd-int-parser';

export function picDecodeCommand(cmd: Command): Command {
  cmd
    .command('decode')
    .argument('<id>', 'Picture resource number', cmdIntParser)
    .option('-d, --decompress', 'decompress', false)
    .action(Actions.picDecode);

  return cmd;
}
