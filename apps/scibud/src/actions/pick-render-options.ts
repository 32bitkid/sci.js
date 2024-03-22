import { RenderPicOptions } from '../models/render-pic-options';

export const pickRenderOptions = <T extends RenderPicOptions>(
  options: T,
): [Omit<T, keyof RenderPicOptions>, RenderPicOptions] => {
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
