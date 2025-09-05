import type { IndexedPixelData } from '@4bitlabs/image';

export interface FontFace {
  characters: IndexedPixelData[];
  lineHeight: number;
}
