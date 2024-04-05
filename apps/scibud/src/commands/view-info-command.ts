import { Command } from 'commander';

import { viewInfoAction } from '../actions';
import { cmdIntParser } from './cmd-int-parser';

export function viewInfoCommand(cmd: Command): Command {
  cmd
    .command('info')
    .argument('<num>', 'View resource number', cmdIntParser)
    .action(viewInfoAction)
    .description('get view info');

  return cmd;
}
