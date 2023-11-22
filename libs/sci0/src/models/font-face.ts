import type { ImageDataLike } from '@4bitlabs/image';

export interface FontFace {
  characters: ImageDataLike[];
  lineHeight: number;
}
