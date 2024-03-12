import { renderPic } from '@4bitlabs/sci0';
import {
  FilterPipeline,
  createDitherizer,
  gaussBlur,
  nearestNeighbor,
  scale2x,
  scale3x,
  scale5x6,
  hBlur,
} from '@4bitlabs/image';
import { PNG } from 'pngjs';
import { writeFile } from 'fs/promises';
import {
  RAW_CGA,
  TRUE_CGA,
  DGA_PALETTE,
  Mixers,
  generateSciDitherPairs,
  IBM5153Dimmer,
} from '@4bitlabs/color';
import { DrawCommand } from '@4bitlabs/sci0/dist/models/draw-command';

const pipeline: FilterPipeline = [
  // createDitherizer(generateSciDitherPairs(RAW_CGA)),
  // scale5x6,
  nearestNeighbor([5, 6]),
  createDitherizer(
    generateSciDitherPairs(IBM5153Dimmer(TRUE_CGA, 0.6), Mixers.softMixer()),
    [5, 4],
  ),
  (img) => {
    hBlur(img, 2);
    return img;
  },
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
