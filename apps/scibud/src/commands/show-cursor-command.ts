import type { Command } from 'commander';

import { cmdIntParser } from './cmd-int-parser';
import { showCursorAction } from '../actions';

export const showCursorCommand = (fontCmd: Command) => {
  fontCmd
    .command('show')
    .argument('<num>', 'cursor number', cmdIntParser)
    .action(showCursorAction);
};
