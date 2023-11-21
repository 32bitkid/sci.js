#!/usr/bin/env node
import { program, InvalidArgumentError } from 'commander';
import { resolve } from 'path';
import expandTilde from 'expand-tilde';

import workers from './workers';
import * as Actions from './actions';

function cmdParseInt(value: string): number | false {
  if (/^\s*f(alse)?\s*$/i.test(value)) return false;
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) throw new InvalidArgumentError('Not a number.');
  return parsedValue;
}

const cmdPathParser = (value: string) => resolve(expandTilde(value));

program.option('-r, --root <path>', '', cmdPathParser, '.');

const pics = program.command('pic');

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
  .action(Actions.renderPic);

pics.command('list').action(Actions.listPics);

program
  .parseAsync()
  .catch((err) => console.error(err))
  .finally(() => workers.terminate());
