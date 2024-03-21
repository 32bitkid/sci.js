#!/usr/bin/env node
import { program, Option, Command } from 'commander';

import workers from './workers';
import * as Commands from './commands';
import { cmdPathParser } from './commands/cmd-path-parser';

program
  .option('-r, --root <path>', '', cmdPathParser, '.')
  .addOption(
    new Option('-e --engine <version>', 'sci engine version')
      .default('sci0')
      .choices(['sci0', 'sci01']),
  );

const pics = program.command('pic');
[
  Commands.picListCommand,
  Commands.picInfoCommand,
  Commands.picRenderCommand,
  Commands.picDecodeCommand,
].reduce((cmd, fn) => fn(cmd), pics);

program
  .parseAsync()
  .catch((err) => console.error(err))
  .finally(() => workers.terminate());
