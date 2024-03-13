import { writeFile } from 'fs/promises';

import { PNG } from 'pngjs';

import {
  /* eslint-disable @typescript-eslint/no-unused-vars -- experimenting with different options */
  RAW_CGA,
  TRUE_CGA,
  DGA_PALETTE,
  Mixers,
  generateSciDitherPairs,
  IBM5153Dimmer,
  /* eslint-enable */
} from '@4bitlabs/color';
import {
  FilterPipeline,
  createDitherizer,
  Scalers,
  BlurFilters,
} from '@4bitlabs/image';
import { renderPic, DrawCommand } from '@4bitlabs/sci0';

const pipeline: FilterPipeline = [
  // createDitherizer(generateSciDitherPairs(RAW_CGA)),
  // scale5x6,
  Scalers.nearestNeighbor([5, 6]),
  createDitherizer(
    generateSciDitherPairs(IBM5153Dimmer(TRUE_CGA, 0.7), Mixers.softMixer()),
    [5, 3],
  ),
  BlurFilters.boxBlur(2),
];

const fileName = (base: string, i: number) =>
  base.replace(/%d/g, i.toString().padStart(4, '0'));

export async function renderPicWorker(
  base: string,
  picData: DrawCommand[],
  idx: number,
  repeat: number,
) {
  const { visible } = renderPic(picData, {
    forcePal: 0,
    pipeline,
  });

  const img = new PNG({ width: visible.width, height: visible.height });
  img.data.set(visible.data, 0);

  const outPng = PNG.sync.write(img);

  for (let i = 0; i < repeat + 1; i += 1) {
    await writeFile(fileName(base, idx + i), outPng);
  }
}
