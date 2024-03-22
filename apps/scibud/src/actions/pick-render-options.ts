import { RenderOptions } from '../models/render-options';

export const pickRenderOptions = <T extends RenderOptions>(
  options: T,
): [Omit<T, keyof RenderOptions>, RenderOptions] => {
  const {
    blur,
    blurAmount,
    contrast,
    dither,
    forcePal,
    palette,
    paletteMixer,
    postScaler,
    preScaler,
    format,
    ...rest
  } = options;

  return [
    rest,
    {
      blur,
      blurAmount,
      contrast,
      dither,
      forcePal,
      palette,
      paletteMixer,
      postScaler,
      preScaler,
      format,
    },
  ];
};
