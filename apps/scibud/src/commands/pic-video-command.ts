import { type Command, Option } from 'commander';

import * as Actions from '../actions';
import { cmdIntParser } from './cmd-int-parser';
import * as RenderOptions from './render-options';

const layerOption = () =>
  new Option('-l, --layer <layer>')
    .choices(['visible', 'priority', 'control'])
    .default('visible');

export function picVideoCommand(root: Command): Command {
  root
    .command('video', { hidden: true })
    .argument('<num>', 'picture resource number', cmdIntParser)
    .addOption(layerOption())
    .addOption(RenderOptions.scalerOption('pre'))
    .addOption(RenderOptions.ditherOption())
    .addOption(RenderOptions.paletteOption())
    .addOption(RenderOptions.contrastOption())
    .addOption(RenderOptions.paletteMixerOption())
    .addOption(RenderOptions.scalerOption('post'))
    .addOption(RenderOptions.blurOption())
    .addOption(RenderOptions.blurAmountOption())
    .addOption(RenderOptions.forcePalOption())
    .addOption(RenderOptions.formatOption())
    .addOption(RenderOptions.grayscaleOption())
    .addOption(new Option('-t, --title <title>', 'display title').default(''))
    .addOption(
      new Option('--fps <number>', 'fps').default(60).argParser(cmdIntParser),
    )
    .addOption(
      new Option(
        '-o, --output <string>',
        'output filename, "%d" for frame count',
      ),
    )
    .action(Actions.picVideoAction);

  return root;
}
