import { type IndexedPixelData, createIndexedPixelData } from '@4bitlabs/image';
import { FontFace } from '../models/font-face';
import { repeat } from '../utils/repeat';

const [OFF, ON] = [0x00, 0x0f];

export const parseFrom = (source: Uint8Array): FontFace => {
  const headerView = new DataView(source.buffer, source.byteOffset, 6);
  const count = headerView.getUint16(2, true);
  const lineHeight = headerView.getUint16(4, true);

  const pointersView = new DataView(
    source.buffer,
    source.byteOffset + 6,
    count * 2,
  );
  const pointers = repeat(count, (i) => pointersView.getUint16(i * 2, true));

  const characters = pointers.map<IndexedPixelData>((offset) => {
    const [width, height] = [source[offset], source[offset + 1]];

    const widthBytes = (width + 7) >>> 3;

    const image = createIndexedPixelData(width, height, { keyColor: OFF });

    for (let y = 0; y < height; y++) {
      const yOffset = offset + 2 + y * widthBytes;

      for (let x = 0; x < width; x++) {
        const idx = yOffset + (x >>> 3);
        const bit = (source[idx] >>> (7 - (x & 0b111))) & 1;
        image.pixels[x * 4 + y * width * 4] = bit ? ON : OFF;
      }
    }
    return image;
  });

  return {
    characters,
    lineHeight,
  };
};
