import { ImageLike } from '@4bitlabs/shared';

import { repeat } from './repeat';

interface ViewFrame extends ImageLike {
  ega: Uint8ClampedArray;
  keyColor: number;
  dx: number;
  dy: number;
}

export interface ViewGroup {
  frames: ViewFrame[];
  isMirrored: boolean;
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

export const parseFrom = (source: Uint8Array): ViewGroup[] => {
  const view = new DataView(
    source.buffer,
    source.byteOffset,
    source.byteLength,
  );

  const groupCount = view.getUint16(0, true);
  const mirrored = view.getUint16(2, true);

  return repeat(groupCount, (groupIdx) => {
    const groupOffset = view.getUint16(8 + groupIdx * 2, true);

    const groupView = new DataView(
      source.buffer,
      source.byteOffset + groupOffset,
    );
    const frameCount = groupView.getUint16(0, true);
    const isMirrored = (mirrored & (1 << groupIdx)) !== 0;

    const frames = repeat<ViewFrame>(frameCount, (frameIdx) => {
      const frameOffset = groupView.getUint16(frameIdx * 2 + 4, true);
      const frameView = new DataView(
        source.buffer,
        source.byteOffset + frameOffset,
      );

      const [width, height] = [
        frameView.getUint16(0, true),
        frameView.getUint16(2, true),
      ];
      const [x, y] = [frameView.getUint8(4), frameView.getUint8(5)];
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
        dx: x > 127 ? x - 256 : x,
        dy: y,
      };
    });

    return {
      frames,
      isMirrored,
    };
  });
};
