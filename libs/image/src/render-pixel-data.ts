import { RAW_CGA } from '@4bitlabs/color';
import { type ImageDataLike, createImageData } from './image-data-like';
import { IndexedPixelData } from './indexed-pixel-data';

interface RenderCelOptions {
  palette?: Uint32Array;
  transparent?: number;
}

const DEFAULT_PALETTE = RAW_CGA;
const TRANS = 0x00000000;

export const renderPixelData = (
  cel: IndexedPixelData,
  options: RenderCelOptions = {},
): ImageDataLike => {
  const { palette = DEFAULT_PALETTE, transparent = TRANS } = options;
  const { keyColor } = cel;

  const size = cel.width * cel.height;

  const imgData = createImageData(cel.width, cel.height);
  const output = new Uint32Array(
    imgData.data,
    imgData.data.byteOffset,
    imgData.data.byteLength / 4,
  );

  for (let i = 0; i < size; i++) {
    const val = cel.pixels[i];
    output[i] =
      keyColor !== undefined && val === keyColor ? transparent : palette[val];
  }

  return imgData;
};
