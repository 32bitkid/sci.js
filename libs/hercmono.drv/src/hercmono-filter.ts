import { screenFilter } from '@4bitlabs/blend-filters';
import { boxBlur } from '@4bitlabs/blur-filters';
import {
  type PaletteFilter,
  type IndexedPixelData,
  asRGBA,
  createImageData,
  padImageFilter,
} from '@4bitlabs/image';
import { nearestNeighbor } from '@4bitlabs/resize-filters';

import { type DitherPreset, DitherPresets } from './hercules-dithers.js';
import { Phosphors, type PhosphorTypes } from './phosphors.js';

export interface HercMonoOptions {
  /** Selected dither patterns. @defaultValue `"pq2"` */
  patterns?: DitherPreset;
  /** Selected phosphor type. @defaultValue `"P1"` */
  phosphors?: PhosphorTypes;
}

const hercPad = padImageFilter([57, 40, 42], { backgroundColor: 0xff000000 });
const blur = boxBlur(5);

/**
 * @param options.patterns
 * @param options.phosphors
 */
export const hercMonoFilter = (
  options: HercMonoOptions = {},
): PaletteFilter => {
  const { phosphors = 'P1', patterns = 'pq2' } = options;
  const patternSet = DitherPresets[patterns];
  const [on, glow, off] = Phosphors[phosphors];

  return (source: IndexedPixelData) => {
    const resize = nearestNeighbor([2, 1.5]);
    const resized = resize(source);
    const pixelsImg = createImageData(resized.width, resized.height);
    const glowImg = createImageData(resized.width, resized.height);
    const outRGBA = asRGBA(pixelsImg);
    const glowRGBA = asRGBA(glowImg);

    for (let y = 0; y < resized.height; y++)
      for (let x = 0; x < resized.width; x++) {
        const idx = x + y * resized.width;
        const patternIdx = resized.pixels[idx];
        const set = patternSet[patternIdx * 8 + (y % 8)] & (1 << (7 - (x % 8)));
        outRGBA[idx] = set ? on : off;
        glowRGBA[idx] = set ? glow : off;
      }

    return screenFilter(hercPad(pixelsImg), blur(hercPad(glowImg)));
  };
};
