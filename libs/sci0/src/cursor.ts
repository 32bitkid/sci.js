interface ImageLike {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray;
}

const BLACK = Uint8ClampedArray.of(0x00, 0x00, 0x00, 0xff);
const WHITE = Uint8ClampedArray.of(0xff, 0xff, 0xff, 0xff);
const GRAY = Uint8ClampedArray.of(0xaa, 0xaa, 0xaa, 0xff);
const TRANS = Uint8ClampedArray.of(0x7f, 0x7f, 0x7f, 0x00);

type CursorMapping = [
  Uint8ClampedArray,
  Uint8ClampedArray,
  Uint8ClampedArray,
  Uint8ClampedArray,
];

export const DEFAULT_MAPPING: CursorMapping = [BLACK, WHITE, TRANS, GRAY];
export const LB_MAPPING: CursorMapping = [BLACK, WHITE, TRANS, WHITE];

interface ParseCursorOptions {
  mapping?: CursorMapping;
}

interface Cursor extends ImageLike {
  readonly width: 16;
  readonly height: 16;
  readonly hotspot: readonly [number, number];
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

  const data = new Uint8ClampedArray(16 * 16 * 4);
  const stride = 16 * 4;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = 4 + y * 2;

      const tx = view.getUint16(idx, true);
      const clr = view.getUint16(idx + 32, true);

      const a = (tx >> (15 - x)) & 1;
      const b = (clr >> (15 - x)) & 1;
      const value = (a << 1) | b;
      data.set(mapping[value], x * 4 + y * stride);
    }
  }

  return {
    width: 16,
    height: 16,
    data,
    hotspot,
  };
};
