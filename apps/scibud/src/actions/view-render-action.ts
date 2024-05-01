import { createWriteStream } from 'node:fs';

import { Command } from 'commander';
import GifEncoder from 'gif-encoder';
import sharp, { type Sharp } from 'sharp';

import { decompress, loopPaddingFilter, parseView } from '@4bitlabs/sci0';
import {
  createImageData,
  createPaletteFilter,
  padPixelsFilter,
  renderPixelData,
} from '@4bitlabs/image';
import { loadContentFromMap } from './load-content-from-map';
import { viewMatcher } from '../helpers/resource-matchers';
import { getRootOptions } from './get-root-options';
import {
  generatePalette,
  getScalerFromOptions,
} from '../helpers/create-pic-pipeline';
import { ScalerID } from '../models/render-pic-options';

type Padding =
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

const hasPadding = (it: Padding | undefined): it is Padding => {
  return !(it?.every((v) => v === 0) ?? true);
};

interface ViewRenderActionOptions {
  padding: Padding | undefined;
  animated: boolean;
  palette: 'cga' | 'true-cga' | 'dga';
  contrast: number;
  scaler: ScalerID;
  output: string;
  format: 'jpg' | 'png' | 'webp' | 'raw';
}

const FORMAT_MAPPING = {
  png: (source: Sharp) => source.png().toBuffer(),
  jpg: (source: Sharp) => source.jpeg().toBuffer(),
  webp: (source: Sharp) => source.webp().toBuffer(),
  raw: (source: Sharp) => source.raw().toBuffer(),
};

export async function viewRenderAction(
  id: number,
  loopId: number,
  options: ViewRenderActionOptions,
  cmd: Command,
) {
  const {
    format,
    animated,
    output = `view.${id.toString(10).padStart(3, '0')}-${loopId.toString(10)}.${format}`,
  } = options;
  const { root, engine } = getRootOptions(cmd);

  const [header, compressed] = await loadContentFromMap(root, viewMatcher(id));
  const viewData = decompress(engine, header.compression, compressed);
  const view = parseView(viewData);

  const loop = view[loopId];

  if (!loop)
    cmd.error(`Error: loop ${loopId} is not valid`, { code: 'INVALID_LOOP' });

  const backgroundColor = animated ? 0xffff00ff : 0x00000000;

  const palette = generatePalette(options);
  const pipeline = {
    pre: [
      loopPaddingFilter(loop),
      hasPadding(options.padding) && padPixelsFilter(options.padding),
    ],
    dither: createPaletteFilter(palette, { backgroundColor }),
    post: [getScalerFromOptions(options.scaler)],
  };

  const allFrames = loop.frames.map((frame) =>
    renderPixelData(frame, pipeline),
  );

  if (animated) {
    const gif = new GifEncoder(allFrames[0].width, allFrames[0].height);

    if (output !== '-' && !output.endsWith('.gif'))
      cmd.error('only .gif files are supported for animated output');

    const stream =
      output !== '-'
        ? createWriteStream(output, { flags: 'w' })
        : process.stdout;

    gif.pipe(stream);
    gif.writeHeader();
    gif.setFrameRate(7.5);
    gif.setTransparent(backgroundColor);
    allFrames.forEach((it) => gif.addFrame(it.data));
    gif.finish();
  } else {
    const [totalWidth, totalHeight] = allFrames.reduce(
      ([prevW, prevH], imgData) => [
        Math.max(prevW, imgData.width),
        prevH + imgData.height,
      ],
      [0, 0],
    );

    const [compositeImage] = allFrames.reduce(
      ([sheet, offset], current) => {
        const { data, width, height } = current;
        const size = width * height * 4;
        sheet.data.set(data, offset);
        return [sheet, offset + size];
      },
      [createImageData(totalWidth, totalHeight), 0],
    );

    const image = sharp(compositeImage.data, {
      raw: {
        width: compositeImage.width,
        height: compositeImage.height,
        channels: 4,
      },
    });

    if (output === '-') {
      process.stdout.write(await FORMAT_MAPPING[format](image));
    } else {
      image.toFile(output);
    }
  }
}
