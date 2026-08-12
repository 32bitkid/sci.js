import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  decompress,
  parseAllMappings,
  parseFont,
  parseHeaderWithPayload,
  ResourceMatchers,
  ResourceTypes,
} from '@4bitlabs/sci0';
import { ensureExists } from './ensure-exists.js';

export async function findAndParseFont(
  rootPath: string,
  id: number,
  engine: 'sci0' | 'sci01',
) {
  const files = await readdir(rootPath);
  const matchFn = ResourceMatchers.match({
    number: id,
    type: ResourceTypes.FONT_TYPE,
  });

  const resourceMapFn = files.find((s) => s.match(/^resource.map$/i));
  ensureExists(resourceMapFn, `RESOURCE.MAP not found`);

  if (resourceMapFn === undefined) throw new Error('RESOURCE.MAP not found');
  const mappingPath = join(rootPath, resourceMapFn);
  const mappings = parseAllMappings(await readFile(mappingPath));

  const match = mappings.find(matchFn);
  ensureExists(match, `Resource FONT:${id} not found…`);

  const resourceFn = files.find((s) => {
    const ext = match.file.toString(10).padStart(3, '0');
    return s.match(new RegExp(`^resource.${ext}$`, 'i'));
  });
  ensureExists(resourceFn, `${resourceFn} not found…`);

  const resourcePath = join(rootPath, resourceFn);
  const [header, resourcePayload] = parseHeaderWithPayload(
    await readFile(resourcePath),
    match.offset,
  );
  const payload = decompress(engine, header.compression, resourcePayload);
  return parseFont(payload, { keyColor: 0x00, color: 0xff });
}
