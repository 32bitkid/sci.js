import { RenderOptions } from '../models/render-options';
import {
  RAW_CGA,
  TRUE_CGA,
  DGA_PALETTE,
  Mixers,
  generateSciDitherPairs as generatePairs,
  IBM5153Dimmer,
} from '@4bitlabs/color';
import { createDitherizer, Scalers, BlurFilters } from '@4bitlabs/image';
import { type FilterPipeline } from '@4bitlabs/sci0';

const SCALER_MAPPING = {
  '2x': Scalers.nearestNeighbor([2, 2]),
  '3x': Scalers.nearestNeighbor([3, 3]),
  '4x': Scalers.nearestNeighbor([4, 4]),
  '5x': Scalers.nearestNeighbor([5, 5]),
  '5x6': Scalers.nearestNeighbor([5, 6]),
  scale2x: Scalers.scale2x,
  scale3x: Scalers.scale3x,
  scale5x6: Scalers.scale5x6,
};

const BLUR_FILTER_MAPPING = {
  box: BlurFilters.boxBlur,
  hbox: BlurFilters.hBoxBlur,
  hblur: BlurFilters.hBlur,
  gauss: BlurFilters.gaussBlur,
};

export function createPipeline(options: RenderOptions): FilterPipeline {
  const pipeline: FilterPipeline = [];

  if (options.preScaler !== 'none') {
    const preScaler = SCALER_MAPPING[options.preScaler];
    pipeline.push(preScaler);
  }

  const basePalette = {
    cga: RAW_CGA,
    'true-cga': TRUE_CGA,
    dga: DGA_PALETTE,
  }[options.palette];

  const palette =
    options.contrast && options.contrast <= 1.0
      ? IBM5153Dimmer(basePalette, options.contrast)
      : basePalette;

  const pairs = {
    none: generatePairs(palette),
    '10%': generatePairs(palette, Mixers.mixBy(0.1)),
    '15%': generatePairs(palette, Mixers.mixBy(0.15)),
    '25%': generatePairs(palette, Mixers.mixBy(0.25)),
    '50%': generatePairs(palette, Mixers.mixBy(0.5)),
    soft: generatePairs(palette, Mixers.softMixer()),
  }[options.paletteMixer];

  pipeline.push(createDitherizer(pairs, options.dither));

  if (options.postScaler !== 'none') {
    const postScaler = SCALER_MAPPING[options.postScaler];
    pipeline.push(postScaler);
  }

  if (options.blur !== 'none' && options.blurAmount) {
    const blurFilter = BLUR_FILTER_MAPPING[options.blur];
    pipeline.push(blurFilter(options.blurAmount));
  }

  return pipeline;
}
