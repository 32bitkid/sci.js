import { Command } from 'commander';

import * as Actions from '../actions';
import { cmdParseInt } from './cmd-parse-int';

export function picDecodeCommand(cmd: Command): Command {
  cmd
    .command('decode')
    .argument('<id>', 'Picture resource number', cmdParseInt)
    .option('-d, --decompress', 'decompress', false)
    .action(Actions.picDecode);

  return cmd;
}
