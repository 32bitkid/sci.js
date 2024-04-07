import type { Command } from 'commander';

import { cmdIntParser } from './cmd-int-parser';
import { showFontAction } from '../actions';

export const showFontCommand = (fontCmd: Command) => {
  fontCmd
    .command('show')
    .argument('<num>', 'font number', cmdIntParser)
    .action(showFontAction);
};
