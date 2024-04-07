#!/usr/bin/env node
import { Command, Option } from 'commander';

import { ResourceTypes } from '@4bitlabs/sci0';
import workers from './workers';
import * as Commands from './commands';
import { cmdPathParser } from './commands/cmd-path-parser';

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

applySubCommands(
  program.command('pic').description('"pic" resource commands'),
  Commands.listCommandForType(ResourceTypes.PIC_TYPE),
  Commands.extractCommandForType(ResourceTypes.PIC_TYPE),
  Commands.picInfoCommand,
  Commands.picRenderCommand,
);

applySubCommands(
  program.command('view').description('"view" resource commands'),
  Commands.listCommandForType(ResourceTypes.VIEW_TYPE),
  Commands.extractCommandForType(ResourceTypes.VIEW_TYPE),
  Commands.viewInfoCommand,
  Commands.viewRenderCommand,
);

applySubCommands(
  program.command('script').description('"script" resource commands'),
  Commands.listCommandForType(ResourceTypes.SCRIPT_TYPE),
  Commands.extractCommandForType(ResourceTypes.SCRIPT_TYPE),
);

applySubCommands(
  program.command('text').description('"text" resource commands'),
  Commands.listCommandForType(ResourceTypes.TEXT_TYPE),
  Commands.extractCommandForType(ResourceTypes.TEXT_TYPE),
);

applySubCommands(
  program.command('sound').description('"sound" resource commands'),
  Commands.listCommandForType(ResourceTypes.SOUND_TYPE),
  Commands.extractCommandForType(ResourceTypes.SOUND_TYPE),
);

applySubCommands(
  program.command('memory').description('"memory" resource commands'),
  Commands.listCommandForType(ResourceTypes.MEMORY_TYPE),
  Commands.extractCommandForType(ResourceTypes.MEMORY_TYPE),
);

applySubCommands(
  program.command('vocab').description('"vocab" resource commands'),
  Commands.listCommandForType(ResourceTypes.VOCAB_TYPE),
  Commands.extractCommandForType(ResourceTypes.VOCAB_TYPE),
);

applySubCommands(
  program.command('font').description('"font" resource commands'),
  Commands.listCommandForType(ResourceTypes.FONT_TYPE),
  Commands.extractCommandForType(ResourceTypes.FONT_TYPE),
  Commands.showFontCommand,
);

applySubCommands(
  program.command('cursor').description('"cursor" resource commands'),
  Commands.listCommandForType(ResourceTypes.CURSOR_TYPE),
  Commands.extractCommandForType(ResourceTypes.CURSOR_TYPE),
  Commands.showCursorCommand,
);

applySubCommands(
  program.command('patch').description('"patch" resource commands'),
  Commands.listCommandForType(ResourceTypes.PATCH_TYPE),
  Commands.extractCommandForType(ResourceTypes.PATCH_TYPE),
);

program
  .parseAsync()
  .catch((err: unknown) => {
    console.error(
      err
        ? err instanceof Error
          ? `error: ${err.message}`
          : typeof err === 'string'
            ? err
            : 'error: unknown'
        : 'error: unknown',
    );
  })
  .finally(() => workers.terminate());
