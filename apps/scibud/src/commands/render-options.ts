import { Option } from 'commander';

import { cmdDimensionsParser } from './cmd-dimensions-parser';
import { cmdFloatParser } from './cmd-float-parser';

export const forcePalOption = () =>
  new Option(`-F, --force-pal <value>`, 'Force ')
    .choices(['0', '1', '2', '3'])
    .default('0');

export const ditherOption = () =>
  new Option('-d, --dither <dither>', 'dither sizing.')
    .argParser(cmdDimensionsParser)
    .default([1, 1], '"1x1"');

export const scalerOption = (type: 'pre' | 'post'): Option =>
  new Option(
    `-${type === 'post' ? 's' : 'S'}, --${type}-scaler <scaler>`,
    `${type}-dither pixel scaler`,
  )
    .choices([
      'none',
      '2x',
      '3x',
      '4x',
      '5x',
      '5x6',
      'scale2x',
      'scale3x',
      'scale5x6',
    ])
    .default(type === 'pre' ? 'none' : '5x6');

export const paletteOption = (): Option =>
  new Option(`-p, --palette <pal>`, 'the base palette')
    .choices(['cga', 'true-cga', 'dga'])
    .default('cga');

export const paletteMixerOption = (): Option =>
  new Option(`-m, --palette-mixer <pal>`, 'palette mixing function')
    .choices(['none', '10%', '15%', '25%', 'soft'])
    .default('none');

export const contrastOption = (): Option =>
  new Option(
    `-c, --contrast <value>`,
    'IBM 5153-style contrast knob. <value> should be between 0.0 and 1.0, or false',
  )
    .argParser(cmdFloatParser([0.0, 1.0]))
    .default(false);

export const blurOption = (): Option =>
  new Option(`-b, --blur <method>`, 'apply blur')
    .choices(['none', 'box', 'hbox', 'hblur', 'gauss'])
    .default('none');

export const blurAmountOption = (): Option =>
  new Option(`-a, --blur-amount <amount>`, 'amount of pixels to blur')
    .argParser(cmdFloatParser([0.0, 100.0]))
    .default(1.0);

export const formatOption = (): Option =>
  new Option(
    '-f, --format <format>',
    'image format. used when writing to STDOUT',
  )
    .choices(['png', 'jpeg', 'webp', 'raw'])
    .default('png');
