export interface IRGBA {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a?: number;
}

export type RGBATuple = Readonly<[r: number, g: number, b: number, a?: number]>;

export type RGBA = RGBATuple | IRGBA;

export const asTuple = (c: RGBA): RGBATuple =>
  !('r' in c) ? c : [c.r, c.g, c.b, c.a];
