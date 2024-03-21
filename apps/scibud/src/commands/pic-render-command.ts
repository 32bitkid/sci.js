import { type Command } from 'commander';

import * as Actions from '../actions';
import { cmdParseInt } from './cmd-parse-int';
import { cmdPathParser } from './cmd-path-parser';

export function picRenderCommand(pics: Command): Command {
  pics
    .command('render')
    .argument('<id>', 'Picture resource number', cmdParseInt)
    .option('-o, --outdir <path>', 'output folder', cmdPathParser, '.')
    .option('-f, --filename <string>', 'output filename', undefined)
    .option('--all', 'render all steps as individual frames', false)
    .option(
      '--pre-roll <number>',
      'pre-roll frames. renders the final frame this many times at the beginning of the sequence.',
      cmdParseInt,
      240,
    )
    .action(Actions.picRender);

  return pics;
}
