import { ImageLike } from '@4bitlabs/shared';

const WHITE = Uint8ClampedArray.of(0xff, 0xff, 0xff, 0xff);
const TRANS = Uint8ClampedArray.of(0xff, 0xff, 0xff, 0x00);

const repeat = <T>(n: number, fn: (i: number) => T): T[] =>
  Array(n)
    .fill(null)
    .map((_, i) => fn(i));

interface ParseFontOptions {
  colors?: [Uint8ClampedArray, Uint8ClampedArray];
}

export type Glyph = ImageLike;

export interface FontFace {
  characters: Glyph[];
  lineHeight: number;
}

export const parseFrom = (
  source: Uint8Array,
  options: ParseFontOptions = {},
): FontFace => {
  const { colors: [OFF, ON] = [TRANS, WHITE] } = options;
  const headerView = new DataView(source.buffer, source.byteOffset, 6);
  const count = headerView.getUint16(2, true);
  const lineHeight = headerView.getUint16(4, true);

  const pointersView = new DataView(
    source.buffer,
    source.byteOffset + 6,
    count * 2,
  );
  const pointers = repeat(count, (i) => pointersView.getUint16(i * 2, true));

  const characters = pointers.map((offset) => {
    const [width, height] = [source[offset], source[offset + 1]];

    const widthBytes = (width + 7) >>> 3;

    const data = new Uint8ClampedArray(width * height * 4);

    for (let y = 0; y < height; y++) {
      const yOffset = offset + 2 + y * widthBytes;

      for (let x = 0; x < width; x++) {
        const idx = yOffset + (x >>> 3);
        const bit = (source[idx] >>> (7 - (x & 0b111))) & 1;
        data.set(bit ? ON : OFF, x * 4 + y * width * 4);
      }
    }
    return {
      width,
      height,
      data,
    };
  });

  return {
    characters,
    lineHeight,
  };
};
