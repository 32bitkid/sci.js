import { type Command } from 'commander';

import { decompress } from '@4bitlabs/sci0';
import {
  loadContentFromMap,
  ResourceMapPredicate,
} from './load-content-from-map';

interface PicDecodeOptions {
  decompress: boolean;
}

export const createDecodeActionWithMatcher = (
  matcher: (resId: number) => ResourceMapPredicate,
) =>
  async function decodeAction(
    id: number,
    options: PicDecodeOptions,
    cmd: Command,
  ) {
    const { root, engine } = cmd.optsWithGlobals();
    const [header, rawData] = await loadContentFromMap(root, matcher(id));
    process.stdout.write(
      options.decompress
        ? decompress(engine, header.compression, rawData)
        : rawData,
    );
  };
