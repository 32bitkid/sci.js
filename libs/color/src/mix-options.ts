export type MixMode = 'okLab' | 'CIE-XYZ' | 'CIELAB' | 'sRGB' | 'linear-RGB';

export interface MixOptions {
  /**
   * Determine which color space to perform color blending.
   * @default 'linear-RGB'
   */
  mixMode?: 'okLab' | 'CIE-XYZ' | 'CIELAB' | 'sRGB' | 'linear-RGB';
}
