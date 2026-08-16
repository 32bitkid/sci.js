import type { Command } from 'commander';
import sharp from 'sharp';
import { writeFile, readFile } from 'node:fs/promises';
import { basename } from 'node:path';

import { CGA_PALETTE } from '@4bitlabs/color/palettes';
import { decompress, parseFont, ResourceTypes } from '@4bitlabs/sci0';
import {
  createImageData,
  createPaletteFilter,
  padPixelsFilter,
  renderPixelData,
} from '@4bitlabs/image';
import { getRootOptions } from './get-root-options.js';
import { loadContentFromMap } from './load-content-from-map.js';
import { fontMatcher } from '../helpers/resource-matchers.js';
import { chunk } from '../helpers/chunk.js';
import { nearestNeighbor } from '@4bitlabs/resize-filters';

const getFontData = async (
  fontNum: number,
  options: { output?: string; aspectRatio?: boolean; input?: string },
  thisCmd: Command,
): Promise<Uint8Array> => {
  if (options?.input) {
    const bytes = await readFile(options.input);
    if (bytes[0] !== (ResourceTypes.FONT_TYPE | 0x80)) {
      console.error(`warn: unexpected resource type ${bytes[0] ^ 0x80}`);
    }
    return bytes.subarray(2);
  }

  const { root, engine } = getRootOptions(thisCmd);
  const [header, bytes] = await loadContentFromMap(root, fontMatcher(fontNum));

  return decompress(engine, header.compression, bytes);
};

export const showFontAction = async (
  fontNum: number,
  options: { output?: string; aspectRatio?: boolean; input?: string },
  thisCmd: Command,
) => {
  const { root } = getRootOptions(thisCmd);
  const payload = await getFontData(fontNum, options, thisCmd);
  const { characters } = parseFont(payload);

  const glyphs = characters.map((ch) =>
    renderPixelData(ch, {
      pre: [padPixelsFilter([0, 0, 1, 0])],
      render: createPaletteFilter(CGA_PALETTE),
      post: [options.aspectRatio ? nearestNeighbor([5, 6]) : undefined],
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

  const output = (
    options.output ??
    `font.${fontNum.toString(10).padStart(3, '0')}.${basename(root)}.png`
  ).trim();

  if (output === '-') {
    process.stdout.write(await image.png().toBuffer());
  } else {
    await writeFile(output, await image.png().toBuffer());
  }
};
