import { Command } from 'commander';
import sharp, { OverlayOptions } from 'sharp';

import { decompress, View } from '@4bitlabs/sci0';
import { createPaletteFilter, renderPixelData } from '@4bitlabs/image';
import * as ResizeFilters from '@4bitlabs/resize-filters';
import * as BlurFilters from '@4bitlabs/blur-filters';
import { Palettes, IBM5153Contrast } from '@4bitlabs/color';
import { loadContentFromMap } from './load-content-from-map';
import { viewMatcher } from '../helpers/resource-matchers';

export const concat = (parts: Uint8ClampedArray[]): Uint8ClampedArray => {
  const len = parts.reduce((sum, it) => sum + it.length, 0);
  const result = new Uint8ClampedArray(len);
  parts.reduce((sum, it) => {
    result.set(it, sum);
    return sum + it.length;
  }, 0);
  return result;
};

export async function viewRenderAction(
  id: number,
  loop: number,
  _: unknown,
  cmd: Command,
) {
  const { root, engine } = cmd.optsWithGlobals();

  const [header, compressed] = await loadContentFromMap(root, viewMatcher(id));
  const viewData = decompress(engine, header.compression, compressed);
  const view = View.parseFrom(viewData);

  const pipeline = {
    dither: createPaletteFilter(
      IBM5153Contrast(Palettes.TRUE_CGA_PALETTE, 0.75),
    ),
    post: [
      ResizeFilters.scale5x6,
      // ResizeFilters.nearestNeighbor([5, 6]),
      BlurFilters.hBoxBlur(4),
    ],
  };

  const allFrames = view[loop].frames.map((frame) =>
    renderPixelData(frame, pipeline),
  );

  const [width, height] = allFrames.reduce(
    ([w0, h0], { width: w1, height: h1 }) => [Math.max(w0, w1), h0 + h1],
    [0, 0],
  );

  const rendered = await Promise.all(
    allFrames.map(async ({ data, width, height }) => {
      const buffer = await sharp(data, { raw: { width, height, channels: 4 } })
        .png()
        .toBuffer();
      return { buffer, width, height };
    }),
  );
  const [, layers] = rendered.reduce<[number, OverlayOptions[]]>(
    ([y, stack], frame) => {
      const { buffer, height } = frame;
      return [y + height, [...stack, { input: buffer, top: y, left: 0 }]];
    },
    [0, []],
  );

  const image = sharp({
    create: {
      width,
      height: height,
      channels: 4,
      background: { r: 128, g: 0, b: 0, alpha: 0.25 },
    },
  });

  image.composite(layers);

  process.stdout.write(await image.gif().toBuffer());
}
