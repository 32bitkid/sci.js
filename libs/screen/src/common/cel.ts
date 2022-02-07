export interface Cel<TDepth extends 1 | 2 | 4 | 8 | 32 = 1 | 2 | 4 | 8 | 32> {
  bpp: TDepth;
  data: ArrayBuffer;
  keyColor: number;
  dx: number;
  dy: number;
  width: number;
  height: number;
}
