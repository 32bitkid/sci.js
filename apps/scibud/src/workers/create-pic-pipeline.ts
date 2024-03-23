import {
  Palettes,
  Mixers,
  generateSciDitherPairs as generatePairs,
  IBM5153Contrast,
} from '@4bitlabs/color';
import {
  type PixelFilter,
  createDitherFilter,
  ImageFilter,
  RenderPipeline,
} from '@4bitlabs/image';
import * as ResizeFilters from '@4bitlabs/resize-filters';
import * as BlurFilters from '@4bitlabs/blur-filters';
import { RenderPicOptions } from '../models/render-pic-options';

const SCALER_MAPPING = {
  '2x2': ResizeFilters.nearestNeighbor([2, 2]),
  '3x3': ResizeFilters.nearestNeighbor([3, 3]),
  '4x4': ResizeFilters.nearestNeighbor([4, 4]),
  '5x5': ResizeFilters.nearestNeighbor([5, 5]),
  '5x6': ResizeFilters.nearestNeighbor([5, 6]),
  scale2x: ResizeFilters.scale2x,
  scale3x: ResizeFilters.scale3x,
  scale5x6: ResizeFilters.scale5x6,
};

const BLUR_FILTER_MAPPING = {
  box: BlurFilters.boxBlur,
  hbox: BlurFilters.hBoxBlur,
  hblur: BlurFilters.hBlur,
  gauss: BlurFilters.gaussBlur,
};

export function createPicPipeline(options: RenderPicOptions): RenderPipeline {
  const pre: PixelFilter[] = [];
  if (options.preScaler !== 'none') {
    pre.push(SCALER_MAPPING[options.preScaler]);
  }

  const basePalette = {
    cga: Palettes.CGA_PALETTE,
    'true-cga': Palettes.TRUE_CGA_PALETTE,
    dga: Palettes.DGA_PALETTE,
  }[options.palette];

  const palette =
    options.contrast && options.contrast <= 1.0
      ? IBM5153Contrast(basePalette, options.contrast)
      : basePalette;

  const pairs = {
    none: generatePairs(palette),
    '10%': generatePairs(palette, Mixers.mixBy(0.1)),
    '15%': generatePairs(palette, Mixers.mixBy(0.15)),
    '25%': generatePairs(palette, Mixers.mixBy(0.25)),
    '50%': generatePairs(palette, Mixers.mixBy(0.5)),
    soft: generatePairs(palette, Mixers.softMixer()),
  }[options.paletteMixer];

  const dither = createDitherFilter(pairs, options.dither);

  const post: ImageFilter[] = [];

  if (options.postScaler !== 'none') {
    post.push(SCALER_MAPPING[options.postScaler]);
  }

  if (options.blur !== 'none' && options.blurAmount) {
    const blurFilter = BLUR_FILTER_MAPPING[options.blur];
    const blur = blurFilter(options.blurAmount);
    post.push(blur);
  }

  return { pre, dither, post };
}
