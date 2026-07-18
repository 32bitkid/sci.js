import type { Command } from 'commander';

import * as Actions from '../actions/index.js';
import { cmdIntParser } from './cmd-int-parser.js';

export function picInfoCommand(cmd: Command): Command {
  cmd
    .command('info')
    .argument('<num>', 'Picture resource number', cmdIntParser)
    .action(Actions.picInfoAction)
    .description('get pic info');

  return cmd;
}
