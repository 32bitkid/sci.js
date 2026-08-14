import { type Command, Option } from 'commander';

import { cmdIntParser } from './cmd-int-parser.js';
import { showFontAction } from '../actions/index.js';

export const showFontCommand = (fontCmd: Command) => {
  fontCmd
    .command('show')
    .argument('<num>', 'font number', cmdIntParser)
    .addOption(
      new Option('-o, --output <fn>', 'output filename, "-" for STDOUT'),
    )
    .addOption(
      new Option('--ar', 'aspect ratio correction, scale to 5:6'),
    )
    .action(showFontAction);
};
