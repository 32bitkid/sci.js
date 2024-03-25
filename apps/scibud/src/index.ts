#!/usr/bin/env node
import { Command, Option } from 'commander';

import { ResourceTypes } from '@4bitlabs/sci0';
import workers from './workers';
import * as Actions from './actions';
import * as Commands from './commands';
import { cmdPathParser } from './commands/cmd-path-parser';
import { cmdIntParser } from './commands/cmd-int-parser';

const program = new Command();

const applySubCommands = (
  cmd: Command,
  ...subCommands: ((root: Command) => void)[]
) => subCommands.forEach((fn) => fn(cmd));

program
  .option('-r, --root <path>', '', cmdPathParser, '.')
  .addOption(
    new Option('-e --engine <version>', 'sci engine version')
      .default('sci0')
      .choices(['sci0', 'sci01']),
  );

Commands.extractCommandForId(program);

applySubCommands(
  program.command('pic').description('"pic" resource commands'),
  Commands.listCommandForType(ResourceTypes.PIC_TYPE),
  Commands.picInfoCommand,
  Commands.picRenderCommand,
);

applySubCommands(
  program.command('view').description('"view" resource commands'),
  Commands.listCommandForType(ResourceTypes.VIEW_TYPE),
  (cmd) => {
    cmd
      .command('render')
      .argument('<id>', 'id to render', cmdIntParser)
      .argument('<loop>', 'loop to render', cmdIntParser)
      .action(Actions.viewRenderAction);
  },
);

applySubCommands(
  program.command('script').description('"script" resource commands'),
  Commands.listCommandForType(ResourceTypes.SCRIPT_TYPE),
);

applySubCommands(
  program.command('text').description('"text" resource commands'),
  Commands.listCommandForType(ResourceTypes.TEXT_TYPE),
);

applySubCommands(
  program.command('sound').description('"sound" resource commands'),
  Commands.listCommandForType(ResourceTypes.SOUND_TYPE),
);

applySubCommands(
  program.command('memory').description('"memory" resource commands'),
  Commands.listCommandForType(ResourceTypes.MEMORY_TYPE),
);

applySubCommands(
  program.command('vocab').description('"vocab" resource commands'),
  Commands.listCommandForType(ResourceTypes.VOCAB_TYPE),
);

applySubCommands(
  program.command('font').description('"font" resource commands'),
  Commands.listCommandForType(ResourceTypes.FONT_TYPE),
);

applySubCommands(
  program.command('cursor').description('"cursor" resource commands'),
  Commands.listCommandForType(ResourceTypes.CURSOR_TYPE),
);

applySubCommands(
  program.command('patch').description('"patch" resource commands'),
  Commands.listCommandForType(ResourceTypes.PATCH_TYPE),
);

program
  .parseAsync()
  .catch((err) => console.error(err))
  .finally(() => workers.terminate());
