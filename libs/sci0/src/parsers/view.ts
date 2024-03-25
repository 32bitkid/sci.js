import { type View, type Loop } from '../models/view';
import { parseCel } from './cel';
import { repeat } from '../utils/repeat';

export const parseFrom = (source: Uint8Array): View => {
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

    return {
      frames,
      isMirrored,
    };
  });
};
