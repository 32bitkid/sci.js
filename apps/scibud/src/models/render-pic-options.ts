export type ScalerID =
  | 'none'
  | '2x2'
  | '3x3'
  | '4x4'
  | '5x5'
  | '5x6'
  | 'scale2x'
  | 'scale3x'
  | 'scale5x6';

export type PaletteID = 'cga' | 'true-cga' | 'dga' | 'depth';
export type MixerID = 'none' | '10%' | '15%' | '25%' | '50%' | 'soft';
export type BlurID = 'none' | 'box' | 'hbox' | 'hblur' | 'gauss';

export interface RenderPipelineOptions {
  readonly preScaler: ScalerID;
  readonly dither: [number, number];
  readonly palette: PaletteID;
  readonly contrast: number | false;
  readonly paletteMixer: MixerID;
  readonly postScaler: ScalerID;
  readonly blur: BlurID;
  readonly blurAmount: number | false;
  readonly grayscale: boolean;
}

export interface RenderPicOptions {
  readonly forcePal: undefined | 0 | 1 | 2 | 3;
  readonly layer: 'visible' | 'control' | 'priority';
  readonly format: 'jpg' | 'png' | 'webp' | 'raw';
}
