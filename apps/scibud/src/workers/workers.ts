import { worker } from 'workerpool';
import { ImageFilter, ImageLike, Sci0 } from '@4bitlabs/screen';
import { scale5x6, nearestNeighbor, scale2x, scale3x } from '@4bitlabs/scalers';
import { PNG } from 'pngjs';
import { writeFile } from 'fs/promises';

const pipeline: ImageFilter[] = [
  (img) => scale2x(scale3x(img)),
  Sci0.createDitherizer(Sci0.SOFT, [3, 3]),
];

const fileName = (base: string, i: number) =>
  base.replace(/%d/g, i.toString().padStart(4, '0'));

worker({
  renderPic: async (base: string, picData, idx: number, repeat: number) => {
    const { visible } = Sci0.renderPic(picData, {
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
