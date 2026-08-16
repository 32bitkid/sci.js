import type { IndexedPixelData } from '@4bitlabs/image';

export interface Glyph extends IndexedPixelData {
  readonly color: number;
  readonly keyColor: number;
}

export interface FontFace {
  characters: Glyph[];
  lineHeight: number;
}
