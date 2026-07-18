import type { Command } from 'commander';

import { cmdIntParser } from './cmd-int-parser.js';
import { showCursorAction } from '../actions/index.js';

export const showCursorCommand = (fontCmd: Command) => {
  fontCmd
    .command('show')
    .argument('<num>', 'cursor number', cmdIntParser)
    .action(showCursorAction);
};
