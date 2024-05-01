import sharp, { type Sharp } from 'sharp';

import { renderPic, type DrawCommand, type FontFace } from '@4bitlabs/sci0';
import {
  createIndexedPixelData,
  PixelFilter,
  renderPixelData,
} from '@4bitlabs/image';
import { createPicPipeline } from '../helpers/create-pic-pipeline';
import { RenderPipelineOptions } from '../models/render-pic-options';

const FORMAT_MAPPING = {
  png: (source: Sharp) => source.png().toBuffer(),
  jpg: (source: Sharp) => source.jpeg().toBuffer(),
  webp: (source: Sharp) => source.webp().toBuffer(),
  raw: (source: Sharp) => source.raw().toBuffer(),
};

const menuFilter =
  (
    ox: number,
    oy: number,
    {
      font,
      left = '',
      right = '',
    }: { font: FontFace; left?: string; right?: string },
  ): PixelFilter =>
  (it) => {
    const output = createIndexedPixelData(it.width, it.height + 10);
    output.pixels.set(it.pixels, it.width * 10);
    for (let i = 0; i < it.width * 10; i++) {
      output.pixels[i] = 0xff;
    }
    left.split('').reduce(($x, ch) => {
      const glyph = font.characters[ch.charCodeAt(0)];
      for (let y = 0; y < glyph.height; y++)
        for (let x = 0; x < glyph.width; x++) {
          if (glyph.pixels[y * glyph.width + x])
            output.pixels[(y + oy) * it.width + ($x + x + ox)] = 0x00;
        }
      return $x + glyph.width;
    }, 0);

    `${right} \u0001`
      .split('')
      .reverse()
      .reduce(($x, ch) => {
        const glyph = font.characters[ch.charCodeAt(0)];
        for (let y = 0; y < glyph.height; y++)
          for (let x = 0; x < glyph.width; x++) {
            if (glyph.pixels[y * glyph.width + x])
              output.pixels[
                (y + oy) * it.width + (it.width - $x - glyph.width - ox + x)
              ] = 0x00;
          }
        return $x + glyph.width;
      }, 0);

    return output;
  };

export async function renderPicWorker(
  outfile: string,
  picData: DrawCommand[],
  layer: 'visible' | 'priority' | 'control',
  forcePal: 0 | 1 | 2 | 3 | undefined,
  format: 'png' | 'jpg' | 'webp' | 'raw',
  options: RenderPipelineOptions,
  message?: { font: FontFace; left: string; right: string },
) {
  const layers = renderPic(picData, { forcePal: forcePal });
  const pipeline = createPicPipeline(layer, options);

  const pre = [message && menuFilter(1, 1, message), ...(pipeline.pre ?? [])];

  const { data, width, height } = renderPixelData(layers[layer], {
    pre,
    dither: pipeline.dither,
    post: pipeline.post,
  });
  const image = sharp(data, { raw: { width, height, channels: 4 } });

  if (outfile === '-') {
    process.stdout.write(await FORMAT_MAPPING[format](image));
  } else {
    await image.toFile(outfile);
  }
}
