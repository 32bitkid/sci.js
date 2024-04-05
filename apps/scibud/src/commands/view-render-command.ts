import { type Command, InvalidOptionArgumentError, Option } from 'commander';

import { cmdIntParser } from './cmd-int-parser';
import * as Actions from '../actions';
import {
  contrastOption,
  formatOption,
  paletteOption,
  scalerOption,
} from './render-options';

function parsePadding(
  val: string,
):
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number] {
  const trimmed = val.trim();
  let match: RegExpMatchArray | null;
  match = trimmed.match(/^(\d+)$/);
  if (match) return [parseInt(match[1], 10)];
  match = trimmed.match(/^(\d+)\s+(\d+)$/);
  if (match) return [parseInt(match[1], 10), parseInt(match[2], 10)];
  match = trimmed.match(/^(\d+)\s+(\d+)\s+(\d+)$/);
  if (match)
    return [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
    ];
  match = trimmed.match(/^(\d+)\s+(\d+)\s+(\d+)\s+(\d+)$/);
  if (match)
    return [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
      parseInt(match[4], 10),
    ];

  throw new InvalidOptionArgumentError(
    `must be "<all>", "<vetical> <horizontal>", "<top> <horizontal> <bottom>", "<top> <right> <bottom> <left>"`,
  );
}

export const viewRenderCommand = (cmd: Command) =>
  cmd
    .command('render')
    .argument('<id>', 'id to render', cmdIntParser)
    .argument('<loop>', 'loop to render', cmdIntParser)
    .addOption(paletteOption())
    .addOption(contrastOption())
    .addOption(scalerOption())
    .addOption(
      new Option('--animated', 'render as sprite sheet').default(false),
    )
    .addOption(
      new Option('--padding <padding>', 'sprite padding').argParser(
        parsePadding,
      ),
    )
    .option(
      '-o, --output <string>',
      'output filename, "-" for STDOUT',
      undefined,
    )
    .addOption(formatOption())
    .action(Actions.viewRenderAction);
