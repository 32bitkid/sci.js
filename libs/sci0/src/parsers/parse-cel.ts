import { createIndexedPixelData } from '@4bitlabs/image';
import { Cel } from '../models/cel';

export const parseCel = (frameView: DataView): Cel => {
  const [width, height] = [
    frameView.getUint16(0, true),
    frameView.getUint16(2, true),
  ];
  const [dx, dy] = [frameView.getInt8(4), frameView.getInt8(5)];
  const keyColor = frameView.getUint8(6);

  const total = width * height;
  const img = createIndexedPixelData(width, height);

  let idx = 0;
  for (let i = 0; i < total; ) {
    const data = frameView.getUint8(7 + idx);
    idx += 1;
    const [color, repeat] = [data & 0xf, data >>> 4];
    for (let r = 0; r < repeat; r++) {
      img.pixels[i] = color;
      i += 1;
    }
  }

  return {
    ...img,
    keyColor,
    dx,
    dy,
  };
};
