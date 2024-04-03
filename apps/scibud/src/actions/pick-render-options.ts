import { RenderPipelineOptions } from '../models/render-pic-options';

export const pickRenderOptions = <T extends RenderPipelineOptions>(
  options: T,
): [Omit<T, keyof RenderPipelineOptions>, RenderPipelineOptions] => {
  const {
    blur,
    blurAmount,
    contrast,
    dither,
    palette,
    paletteMixer,
    postScaler,
    preScaler,
    ...rest
  } = options;

  return [
    rest,
    {
      blur,
      blurAmount,
      contrast,
      dither,
      palette,
      paletteMixer,
      postScaler,
      preScaler,
    },
  ];
};
