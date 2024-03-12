import { RAW_CGA } from '@4bitlabs/color';
import { ImageDataLike } from '@4bitlabs/image';
import { Cel } from '../models/cel';

interface RenderCelOptions {
  palette?: Uint32Array;
  transparent?: number;
}

const DEFAULT_PALETTE = RAW_CGA;
const TRANS = 0x00000000;

export const renderCel = (
  cel: Cel,
  options: RenderCelOptions = {},
): ImageDataLike => {
  const { palette = DEFAULT_PALETTE, transparent = TRANS } = options;

  const size = cel.width * cel.height;

  const input = new Uint8Array(cel.data, 0, size);

  const buffer = new ArrayBuffer(size * 4);
  const output = new Uint32Array(buffer, 0, size);

  for (let i = 0; i < size; i++) {
    const val = input[i];
    output[i] = val !== cel.keyColor ? palette[val] : transparent;
  }

  return {
    data: new Uint8ClampedArray(buffer, 0, size * 4),
    width: cel.width,
    height: cel.height,
  };
};
