import { createIndexedPixelData } from '@4bitlabs/image';
import { type Cursor } from '../models/cursor';

const BLACK = 0x00;
const WHITE = 0x0f;
const GRAY = 0x07;
const TRANS = 0xff;

type CursorMapping = [number, number, number, number];

const DEFAULT_MAPPING: CursorMapping = [BLACK, WHITE, TRANS, GRAY];

export interface ParseCursorOptions {
  mapping?: CursorMapping;
}

export const parseFrom = (
  source: Uint8Array,
  options: ParseCursorOptions = {},
): Cursor => {
  const { mapping = DEFAULT_MAPPING } = options;

  const view = new DataView(
    source.buffer,
    source.byteOffset,
    source.byteLength,
  );

  // Parse data;
  const hotspot = [view.getUint16(0, true), view.getUint16(2, true)] as const;

  const img = createIndexedPixelData(16, 16);
  const stride = 16;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = 4 + y * 2;

      const tx = view.getUint16(idx, true);
      const clr = view.getUint16(idx + 32, true);

      const a = (tx >> (15 - x)) & 1;
      const b = (clr >> (15 - x)) & 1;
      const value = (a << 1) | b;
      img.pixels[x + y * stride] = mapping[value];
    }
  }

  return {
    ...img,
    keyColor: 0xff,
    hotspot,
  };
};
