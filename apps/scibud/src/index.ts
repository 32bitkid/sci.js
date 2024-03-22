#!/usr/bin/env node
import { Command, Option } from 'commander';

import workers from './workers';
import * as Commands from './commands';
import { cmdPathParser } from './commands/cmd-path-parser';

const program = new Command();

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
].reduce((cmd, fn) => {
  fn(cmd);
  return cmd;
}, pics);

program
  .parseAsync()
  .catch((err) => console.error(err))
  .finally(() => workers.terminate());
