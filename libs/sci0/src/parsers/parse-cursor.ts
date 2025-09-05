import { createIndexedPixelData } from '@4bitlabs/image';
import type { Cursor } from '../models/cursor';
import type { ParseCursorOptions } from './parse-cursor-options';

const DEFAULT_MAPPING = {
  black: 0x00,
  white: 0x0f,
  gray: 0x07,
  keyColor: 0x0d,
};

export const parseCursor = (
  source: Uint8Array,
  options: ParseCursorOptions = {},
): Cursor => {
  const { mapping = DEFAULT_MAPPING } = options;
  const { keyColor } = mapping;
  const colorLut = [
    mapping.black,
    mapping.white,
    mapping.keyColor,
    mapping.gray,
  ];

  const view = new DataView(
    source.buffer,
    source.byteOffset,
    source.byteLength,
  );

  const hotspot = [view.getUint16(0, true), view.getUint16(2, true)] as const;

  const img = createIndexedPixelData(16, 16, { keyColor });
  const stride = 16;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = 4 + y * 2;

      const tx = view.getUint16(idx, true);
      const clr = view.getUint16(idx + 32, true);

      const a = (tx >> (15 - x)) & 1;
      const b = (clr >> (15 - x)) & 1;
      const value = (a << 1) | b;
      img.pixels[x + y * stride] = colorLut[value];
    }
  }

  return {
    ...img,
    hotspot,
  };
};
