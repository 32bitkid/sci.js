import { ImageLike } from '@4bitlabs/shared';

export interface Cel extends ImageLike {
  ega: Uint8ClampedArray;
  keyColor: number;
  dx: number;
  dy: number;
}

const TRANS = 0x00000000;

const CGA = Uint32Array.of(
  0xff000000,
  0xffaa0000,
  0xff00aa00,
  0xffaaaa00,
  0xff0000aa,
  0xffaa00aa,
  0xff0055aa,
  0xffaaaaaa,

  0xff555555,
  0xffff5555,
  0xff55ff55,
  0xffffff55,
  0xff5555ff,
  0xffff55ff,
  0xff55ffff,
  0xffffffff,
);

export const parseCel = (frameView: DataView): Cel => {
  const [width, height] = [
    frameView.getUint16(0, true),
    frameView.getUint16(2, true),
  ];
  const [dx, dy] = [frameView.getInt8(4), frameView.getInt8(5)];
  const keyColor = frameView.getUint8(6);

  const total = width * height;
  const ega = new Uint8ClampedArray(total);
  const data = new Uint8ClampedArray(total * 4);
  const bitmap = new Uint32Array(
    data.buffer,
    data.byteOffset,
    data.byteLength / 4,
  );
  let idx = 0;
  for (let i = 0; i < total; ) {
    const data = frameView.getUint8(7 + idx);
    idx += 1;
    const [color, repeat] = [data & 0xf, data >>> 4];
    for (let r = 0; r < repeat; r++) {
      ega[i] = color;
      bitmap[i] = color === keyColor ? TRANS : CGA[color];
      i += 1;
    }
  }

  return {
    data,
    ega,
    height,
    keyColor,
    width,
    dx,
    dy,
  };
};
