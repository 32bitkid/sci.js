import { RenderOptions } from '../models/render-options';
import {
  RAW_CGA,
  TRUE_CGA,
  DGA_PALETTE,
  Mixers,
  generateSciDitherPairs as generatePairs,
  IBM5153Dimmer,
} from '@4bitlabs/color';
import {
  createDitherFilter,
  Scalers,
  BlurFilters,
  IndexedPixelData,
  ImageDataLike,
} from '@4bitlabs/image';

const SCALER_MAPPING = {
  '2x2': Scalers.nearestNeighbor([2, 2]),
  '3x3': Scalers.nearestNeighbor([3, 3]),
  '4x4': Scalers.nearestNeighbor([4, 4]),
  '5x5': Scalers.nearestNeighbor([5, 5]),
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

export function render(
  source: IndexedPixelData,
  options: RenderOptions,
): ImageDataLike {
  let input = source;

  if (options.preScaler !== 'none') {
    const resize = SCALER_MAPPING[options.preScaler];
    input = resize(input);
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

  const dither = createDitherFilter(pairs, options.dither);

  let imgData = dither(input);

  if (options.postScaler !== 'none') {
    const resize = SCALER_MAPPING[options.postScaler];
    imgData = resize(imgData);
  }

  if (options.blur !== 'none' && options.blurAmount) {
    const blurFilter = BLUR_FILTER_MAPPING[options.blur];
    const blur = blurFilter(options.blurAmount);
    imgData = blur(imgData);
  }

  return imgData;
}
