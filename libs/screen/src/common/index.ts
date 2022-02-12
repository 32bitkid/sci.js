export { ImageLike, ImageFilter } from './image-like';
export { EGA_PALETTE, BW_PALETTE, DGA_PALETTE } from './palettes';

export { DrawCommand, DrawMode, DrawCodes, PatternCode } from './draw-command';
export { Plotter, Brusher, IsFillable, Filler, Screen } from './screen';
export { redMeanDiff } from './red-mean-diff';
export { Cel } from './cel';

import { softMixer, mixBy, DitherPair, DitherTransform } from './mixers';
export const Mixers = { softMixer, mixBy };
export { DitherTransform, DitherPair };
