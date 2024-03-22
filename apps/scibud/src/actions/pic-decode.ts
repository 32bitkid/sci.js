import { program } from 'commander';

import { decompress } from '@4bitlabs/sci0';
import { picMatcher } from '../helpers/resource-matchers';
import { loadContentFromMap } from './load-content-from-map';

interface PicDecodeOptions {
  decompress: boolean;
}

export async function picDecode(pic: number, options: PicDecodeOptions) {
  const { root, engine } = program.opts();
  const [header, rawData] = await loadContentFromMap(root, picMatcher(pic));
  process.stdout.write(
    options.decompress
      ? decompress(engine, header.compression, rawData)
      : rawData,
  );
}
