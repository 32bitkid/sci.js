import { Command } from 'commander';

import * as Actions from '../actions';
import { cmdIntParser } from './cmd-int-parser';

export function picInfoCommand(cmd: Command): Command {
  cmd
    .command('info')
    .argument('<id>', 'Picture resource number', cmdIntParser)
    .action(Actions.picInfo)
    .description('get pic info');

  return cmd;
}
