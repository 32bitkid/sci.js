import {
  Dithers,
  IBM5153Contrast,
  Mixers,
  Palettes,
  toGrayscale,
} from '@4bitlabs/color';
import {
  createDitherFilter,
  createPaletteFilter,
  ImageFilter,
  type PixelFilter,
  RenderPipeline,
} from '@4bitlabs/image';
import * as ResizeFilters from '@4bitlabs/resize-filters';
import * as BlurFilters from '@4bitlabs/blur-filters';
import { RenderPipelineOptions } from '../models/render-pic-options';

const DEPTH_PALETTE = Uint32Array.of(
  0xff000000,
  0xff111111,
  0xff222222,
  0xff333333,
  0xff444444,
  0xff555555,
  0xff666666,
  0xff777777,

  0xff888888,
  0xff999999,
  0xffaaaaaa,
  0xffbbbbbb,
  0xffcccccc,
  0xffdddddd,
  0xffeeeeee,
  0xffffffff,
);

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

export function getScalerFromOptions(
  key: keyof typeof SCALER_MAPPING | 'none',
) {
  return key !== 'none' && SCALER_MAPPING[key];
}

export const createPrePipeline = (
  options: RenderPipelineOptions,
): (PixelFilter | false)[] => [getScalerFromOptions(options.preScaler)];

export function createPostPipeline(
  options: RenderPipelineOptions,
): (ImageFilter | false)[] {
  const post: (ImageFilter | false)[] = [
    getScalerFromOptions(options.postScaler),
  ];

  if (options.blur !== 'none' && options.blurAmount) {
    const blurFilter = BLUR_FILTER_MAPPING[options.blur];
    const blur = blurFilter(options.blurAmount);
    post.push(blur);
  }

  return post;
}

export function generatePalette(
  options: Pick<RenderPipelineOptions, 'palette' | 'contrast' | 'grayscale'>,
) {
  const basePalette = {
    cga: Palettes.CGA_PALETTE,
    'true-cga': Palettes.TRUE_CGA_PALETTE,
    dga: Palettes.DGA_PALETTE,
    depth: DEPTH_PALETTE,
  }[options.palette];

  const adjusted =
    options.contrast !== false && options.contrast <= 1.0
      ? IBM5153Contrast(basePalette, options.contrast)
      : basePalette;

  return options.grayscale ? toGrayscale(adjusted) : adjusted;
}

const mixMode = 'CIE-XYZ';

const DITHER_STYLE = {
  none: (pal: Uint32Array) => Dithers.generatePairs(pal),
  '10%': (pal: Uint32Array) =>
    Dithers.generatePairs(pal, Mixers.mixBy(0.1, { mixMode })),
  '15%': (pal: Uint32Array) =>
    Dithers.generatePairs(pal, Mixers.mixBy(0.15, { mixMode })),
  '25%': (pal: Uint32Array) =>
    Dithers.generatePairs(pal, Mixers.mixBy(0.25, { mixMode })),
  '50%': (pal: Uint32Array) =>
    Dithers.generatePairs(pal, Mixers.mixBy(0.5, { mixMode })),
  soft: (pal: Uint32Array) =>
    Dithers.generatePairs(pal, Mixers.softMixer({ mixMode })),
};

export function createPicPipeline(
  layer: 'visible' | 'control' | 'priority',
  options: RenderPipelineOptions,
): RenderPipeline {
  const palette = generatePalette(options);
  const pairs = DITHER_STYLE[options.paletteMixer](generatePalette(options));

  const dither =
    layer === 'visible'
      ? createDitherFilter(pairs, options.dither)
      : createPaletteFilter(palette);

  return {
    pre: createPrePipeline(options),
    dither,
    post: createPostPipeline(options),
  };
}
