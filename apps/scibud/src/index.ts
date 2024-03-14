#!/usr/bin/env node
import { resolve } from 'path';

import { program, InvalidArgumentError, Option } from 'commander';
import expandTilde from 'expand-tilde';

import * as Actions from './actions';
import workers from './workers';

function cmdParseInt(value: string): number | false {
  if (/^\s*f(alse)?\s*$/i.test(value)) return false;
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) throw new InvalidArgumentError('Not a number.');
  return parsedValue;
}

const cmdPathParser = (value: string) => resolve(expandTilde(value));

program
  .option('-r, --root <path>', '', cmdPathParser, '.')
  .addOption(
    new Option('-e --engine <version>', 'sci engine version')
      .default('sci0')
      .choices(['sci0', 'sci01']),
  );

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
  .action(Actions.picRender);

pics.command('list').action(Actions.picList);
pics
  .command('info')
  .argument('<id>', 'Picture resource number', cmdParseInt)
  .action(Actions.picInfo);
pics
  .command('decode')
  .argument('<id>', 'Picture resource number', cmdParseInt)
  .action(Actions.picDecode);

program
  .parseAsync()
  .catch((err) => console.error(err))
  .finally(() => workers.terminate());
