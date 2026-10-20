import type { DitherPair } from '@4bitlabs/color/dithers';
import type { PaletteFilter } from './image-filter.js';
import type { IndexedPixelData } from './indexed-pixel-data.js';
import { createImageData, type ImageDataLike } from './image-data-like.js';

export const reverse = (u32: number, s = 32): number => {
  let r = 0;
  for (; u32 && s; u32 = u32 >>> 1, s--) {
    r = r << 1;
    r |= u32 & 1;
  }
  return (r << s) >>> 0;
};

export function interleave(u16a: number, u16b: number): number {
  let z = 0;
  const bits = Math.min(16, 32 - Math.min(Math.clz32(u16a), Math.clz32(u16b)));
  for (let i = 0; i < bits; i++)
    z |= ((u16a & (0b1 << i)) << i) | ((u16b & (0b1 << i)) << (i + 1));
  return z >>> 0;
}

export function indexMatrixOf(n: number): Uint32Array {
  if ((n & (n - 1)) !== 0) throw new Error('n must be a power of 2');
  const bits = 31 - Math.clz32(n);
  const m = new Uint32Array(n * n);
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      m[i + j * n] = reverse(interleave(i ^ j, j), bits * 2);
    }
  return m;
}

const idxMatrix4 = indexMatrixOf(4);

export function createPatternFilter(
  pal: DitherPair[],
  ditherSize: [number, number] = [1, 1],
): PaletteFilter {
  const idxMatrix = idxMatrix4;
  const size = 4;

  return function patternFilter(
    source: IndexedPixelData,
    dest: ImageDataLike = createImageData(source.width, source.height),
  ) {
    const inData = source.pixels;
    const outData = new Uint32Array(
      dest.data.buffer,
      dest.data.byteOffset,
      dest.data.byteLength >> 2,
    );

    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        const idx = x + y * source.width;
        const src = inData[idx];
        const pair = pal[src];
        const dither =
          idxMatrix[
            ((x / ditherSize[0]) % size) + ((y / ditherSize[1]) % size) * size
          ] >= 8;
        outData[idx] = pair[dither ? 0 : 1];
      }
    }

    return dest;
  };
}
