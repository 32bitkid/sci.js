import { worker } from 'workerpool';
import { Screen } from '@4bitlabs/sci0';
import {
  scale2x,
  scale3x,
  scale5x6,
  nearestNeighbor,
} from '@4bitlabs/image-scalers';
import { PNG } from 'pngjs';
import { writeFile } from 'fs/promises';
import { RAW_CGA, TRUE_CGA, DGA_PALETTE } from '@4bitlabs/color-utils';
import { mixBy, softMixer } from '@4bitlabs/color-utils/dist/mixers';
import { ImageLike } from '@4bitlabs/image-scalers/dist/image-like';

const pipeline = [
  nearestNeighbor([5, 3]),
  Screen.createDitherizer(
    Screen.generateSciDitherPairs(TRUE_CGA, mixBy(0.1)),
    [5, 3],
  ),
  nearestNeighbor([1, 2]),

  // Screen.createDitherizer(Screen.generateSciDitherPairs(RAW_CGA)),
  // nearestNeighbor([5, 6]),
];

const fileName = (base: string, i: number) =>
  base.replace(/%d/g, i.toString().padStart(4, '0'));

worker({
  renderPic: async (base: string, picData, idx: number, repeat: number) => {
    const { visible } = Screen.renderPic(picData, {
      forcePal: 0,
      pipeline,
    });

    const img = new PNG({ width: visible.width, height: visible.height });
    img.data.set(visible.data, 0);

    const outPng = PNG.sync.write(img);

    for (let i = 0; i < repeat + 1; i += 1) {
      await writeFile(fileName(base, idx + i), outPng);
    }
  },
});

/*
ffmpeg -r 60 -f image2 -s 1920x1080 -i ./out/test.%04d.png -vcodec libx264 -crf 25  -pix_fmt yuv420p ./out/test.mp4
 */
