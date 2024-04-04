import { type Command, Option } from 'commander';

import * as Actions from '../actions';
import { cmdIntParser } from './cmd-int-parser';
import * as RenderOptions from './render-options';

export function picRenderCommand(root: Command): Command {
  root
    .command('render')
    .description('render pic resource as image')
    .argument('<id>', 'picture resource number', cmdIntParser)
    .addOption(
      new Option('-l, --layer <layer>')
        .choices(['visible', 'priority', 'control'])
        .default('visible'),
    )
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
    .option(
      '-o, --output <string>',
      'output filename, "-" for STDOUT',
      undefined,
    )
    .action(Actions.picRenderAction);

  return root;
}
