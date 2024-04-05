import { Command } from 'commander';

import * as Actions from '../actions';
import { cmdIntParser } from './cmd-int-parser';

export function picInfoCommand(cmd: Command): Command {
  cmd
    .command('info')
    .argument('<num>', 'Picture resource number', cmdIntParser)
    .action(Actions.picInfoAction)
    .description('get pic info');

  return cmd;
}
