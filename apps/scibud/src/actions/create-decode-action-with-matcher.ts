import { type Command } from 'commander';

import { decompress, getResourceType } from '@4bitlabs/sci0';
import {
  loadContentFromMap,
  ResourceMapPredicate,
} from './load-content-from-map';
import { getRootOptions } from './get-root-options';

interface PicDecodeOptions {
  raw: boolean;
}

export const createDecodeActionWithMatcher = (
  matcher: (resId: number) => ResourceMapPredicate,
) =>
  async function decodeAction(
    id: number,
    options: PicDecodeOptions,
    cmd: Command,
  ) {
    const { root, engine } = getRootOptions(cmd);
    const [header, rawData] = await loadContentFromMap(root, matcher(id));

    const stream = process.stdout;

    if (options.raw) {
      stream.write(rawData);
    } else {
      // preamble
      const data = decompress(engine, header.compression, rawData);
      stream.write(Uint8Array.of(getResourceType(header.id) | 0x80, 0x00));
      stream.write(data);
    }
  };
