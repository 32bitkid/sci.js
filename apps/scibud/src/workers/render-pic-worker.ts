import { writeFile } from 'fs/promises';

import sharp from 'sharp';

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
import { createDitherizer, Scalers, BlurFilters } from '@4bitlabs/image';
import { renderPic, DrawCommand, FilterPipeline } from '@4bitlabs/sci0';

const pipeline: FilterPipeline = [
  // createDitherizer(generateSciDitherPairs(RAW_CGA)),
  // scale5x6,
  Scalers.nearestNeighbor([4, 4]),
  createDitherizer(
    generateSciDitherPairs(IBM5153Dimmer(TRUE_CGA, 0.7), Mixers.softMixer()),
    [4, 4],
  ),
  BlurFilters.gaussBlur(1.5),
  Scalers.nearestNeighbor([0.5, 0.5]),
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

  const outPng = await sharp(visible.data, {
    raw: {
      width: visible.width,
      height: visible.height,
      channels: 4,
    },
  })
    // .resize({
    //   width: dim,
    //   height: dim,
    //   position: 'entropy',
    // })
    .png()
    .toBuffer();

  for (let i = 0; i < repeat + 1; i += 1) {
    await writeFile(fileName(base, idx + i), outPng);
  }
}
