import type { Command } from 'commander';

import { viewInfoAction } from '../actions/index.js';
import { cmdIntParser } from './cmd-int-parser.js';

export function viewInfoCommand(cmd: Command): Command {
  cmd
    .command('info')
    .argument('<num>', 'View resource number', cmdIntParser)
    .action(viewInfoAction)
    .description('get view info');

  return cmd;
}
