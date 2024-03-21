import { Command } from 'commander';

import * as Actions from '../actions';
import { cmdParseInt } from './cmd-parse-int';

export function picInfoCommand(cmd: Command): Command {
  cmd
    .command('info')
    .argument('<id>', 'Picture resource number', cmdParseInt)
    .action(Actions.picInfo)
    .description('get pic info');

  return cmd;
}
