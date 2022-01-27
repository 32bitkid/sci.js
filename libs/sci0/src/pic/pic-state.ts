export enum DrawMode {
  None = 0,
  Visual = 1 << 0,
  Priority = 1 << 1,
  Control = 1 << 2,
}

export type PatternCode = [size: number, isRect: boolean, isTextured: boolean];
export type DrawCodes = [visual: number, priority: number, control: number];

export interface PicState {
  drawMode: DrawMode;
  drawCodes: DrawCodes;
  patternCode: PatternCode;

  palettes: [Uint8Array, Uint8Array, Uint8Array, Uint8Array];
}

const DEFAULT_PALETTE = [
  0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc,
  0xdd, 0xee, 0x88, 0x88, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x88, 0x88, 0xf9,
  0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff, 0x08, 0x91, 0x2a, 0x3b, 0x4c, 0x5d, 0x6e,
  0x88,
];

export const createPicState = (data: Uint8Array): PicState => ({
  drawMode: DrawMode.Visual | DrawMode.Priority,
  drawCodes: [0, 0, 0],
  patternCode: [0, false, true],
  palettes: [
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
    Uint8Array.from(DEFAULT_PALETTE),
  ],
});
