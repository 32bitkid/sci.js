import { ImageDataLike } from './image-like';

export type Glyph = ImageDataLike;

export interface FontFace {
  characters: Glyph[];
  lineHeight: number;
}
