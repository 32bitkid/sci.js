import { type View, type Loop } from '../models/view';
import { parseCel } from './parse-cel';
import { repeat } from '../utils/repeat';

export const parseView = (source: Uint8Array): View => {
  const view = new DataView(
    source.buffer,
    source.byteOffset,
    source.byteLength,
  );

  const groupCount = view.getUint16(0, true);
  const mirrored = view.getUint16(2, true);

  return repeat<Loop>(groupCount, (groupIdx) => {
    const groupOffset = view.getUint16(8 + groupIdx * 2, true);

    const groupView = new DataView(
      source.buffer,
      source.byteOffset + groupOffset,
    );
    const frameCount = groupView.getUint16(0, true);
    const isMirrored = (mirrored & (1 << groupIdx)) !== 0;

    const frames = repeat(frameCount, (frameIdx) => {
      const frameOffset = groupView.getUint16(frameIdx * 2 + 4, true);
      const frameView = new DataView(
        source.buffer,
        source.byteOffset + frameOffset,
      );
      return parseCel(frameView);
    });

    const [left, top, right, bottom] = frames.reduce<
      [number, number, number, number]
    >(
      ([x0, y0, x1, y1], { width, height, dx, dy }) => {
        const fLeft = -(width >>> 1);
        return [
          Math.min(x0, fLeft + dx),
          Math.min(y0, -height + dy),
          Math.max(x1, fLeft + width + dx),
          Math.max(y1, dy),
        ];
      },
      [0, 0, 0, 0],
    );

    return {
      frames,
      isMirrored,
      bounds: {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top,
      },
    };
  });
};
