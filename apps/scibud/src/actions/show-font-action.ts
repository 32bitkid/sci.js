import { type Command } from 'commander';
import sharp from 'sharp';

import { CGA_PALETTE } from '@4bitlabs/color/palettes';
import { decompress, parseFont } from '@4bitlabs/sci0';
import {
  createImageData,
  createPaletteFilter,
  padPixelsFilter,
  renderPixelData,
} from '@4bitlabs/image';
import { getRootOptions } from './get-root-options';
import { loadContentFromMap } from './load-content-from-map';
import { fontMatcher } from '../helpers/resource-matchers';
import { chunk } from '../helpers/chunk';

export const showFontAction = async (
  fontNum: number,
  _: unknown,
  thisCmd: Command,
) => {
  const { root, engine } = getRootOptions(thisCmd);
  const [header, bytes] = await loadContentFromMap(root, fontMatcher(fontNum));

  const payload = decompress(engine, header.compression, bytes);
  const { characters } = parseFont(payload);

  const glyphs = characters.map((ch) =>
    renderPixelData(ch, {
      pre: [padPixelsFilter([0, 0, 1, 0])],
      dither: createPaletteFilter(CGA_PALETTE),
    }),
  );

  const lines = [...chunk(glyphs, 16)];

  const canvasW = lines.reduce((w, line) => {
    const lW = line.reduce((w2, gl) => w2 + gl.width, 0);
    return Math.max(lW, w);
  }, 0);

  const lineMaxHeight = glyphs.reduce((h, gl) => Math.max(gl.height, h), 0);
  const canvasH = lineMaxHeight * lines.length;

  const canvas = createImageData(canvasW, canvasH);
  const cStride = canvasW * 4;

  lines.forEach((line, idx) => {
    const y = idx * lineMaxHeight;
    line.reduce((x, { width, height, data }) => {
      const glStride = width * 4;
      for (let glY = 0; glY < height; glY += 1) {
        const source = glY * glStride;
        const row = data.subarray(source, source + glStride);

        const dest = (y + glY) * cStride + x * 4;
        canvas.data.set(row, dest);
      }
      return x + width;
    }, 0);
  });

  const image = sharp(canvas.data, {
    raw: {
      width: canvasW,
      height: canvasH,
      channels: 4,
    },
  });

  process.stdout.write(await image.png().toBuffer());
};
