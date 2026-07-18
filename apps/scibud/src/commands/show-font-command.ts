import type { Command } from 'commander';

import { cmdIntParser } from './cmd-int-parser.js';
import { showFontAction } from '../actions/index.js';

export const showFontCommand = (fontCmd: Command) => {
  fontCmd
    .command('show')
    .argument('<num>', 'font number', cmdIntParser)
    .action(showFontAction);
};
