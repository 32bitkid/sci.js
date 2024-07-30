import { type Command } from 'commander';
import sharp from 'sharp';

import { CGA_PALETTE } from '@4bitlabs/color/palettes';
import { decompress, parseCursor } from '@4bitlabs/sci0';
import { createPaletteFilter, renderPixelData } from '@4bitlabs/image';
import { getRootOptions } from './get-root-options';
import { loadContentFromMap } from './load-content-from-map';
import { cursorMatcher } from '../helpers/resource-matchers';

export const showCursorAction = async (
  cursorNum: number,
  _: unknown,
  thisCmd: Command,
) => {
  const { root, engine } = getRootOptions(thisCmd);
  const [header, bytes] = await loadContentFromMap(
    root,
    cursorMatcher(cursorNum),
  );

  const payload = decompress(engine, header.compression, bytes);
  const cursor = parseCursor(payload);
  const bitmap = renderPixelData(cursor, {
    render: createPaletteFilter(CGA_PALETTE),
  });

  const image = sharp(bitmap.data, {
    raw: {
      width: bitmap.width,
      height: bitmap.height,
      channels: 4,
    },
  });

  process.stdout.write(await image.png().toBuffer());
};
