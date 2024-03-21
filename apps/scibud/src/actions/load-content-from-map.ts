import {
  getPayloadLength,
  parseAllMappings,
  parseHeaderFrom,
  ResourceHeader,
  ResourceMap,
} from '@4bitlabs/sci0';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function loadContentFromMap(
  root: string,
  matcher: (res: ResourceMap) => boolean,
): Promise<[ResourceHeader, Uint8Array]> {
  const files = await readdir(root);

  const mapFile = files.find((fn) => /^resource.map$/i.test(fn))!;
  const [mapping] = parseAllMappings(await readFile(join(root, mapFile)));
  const { offset, file } = mapping.find(matcher)!;

  const resFn = files.find((fn) =>
    new RegExp(`^resource.${file.toString().padStart(3, '0')}$`, 'i').test(fn),
  )!;

  const resFile = await readFile(join(root, resFn));

  const headerContent = resFile.subarray(offset, offset + 8);
  const header = parseHeaderFrom(headerContent);
  const start = offset + 8;
  const end = start + getPayloadLength(header);
  return [header, resFile.subarray(start, end)];
}