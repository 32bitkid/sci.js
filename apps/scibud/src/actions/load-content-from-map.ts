import {
  getPayloadLength,
  parseAllMappings,
  parseHeaderFrom,
  ResourceHeader,
  ResourceMap,
} from '@4bitlabs/sci0';
import { readFile } from '../helpers/read-file';

export type ResourceMapPredicate = ({ id }: ResourceMap) => boolean;

export async function loadContentFromMap(
  root: string,
  matcher: ResourceMapPredicate,
): Promise<[ResourceHeader, Uint8Array]> {
  const [mapping] = parseAllMappings(await readFile(root, 'RESOURCE.MAP'));
  const { offset, file } = mapping.find(matcher)!;

  const resFilename = `RESOURCE.${file.toString().padStart(3, '0')}`;

  const resFile = await readFile(root, resFilename);

  const headerContent = resFile.subarray(offset, offset + 8);
  const header = parseHeaderFrom(headerContent);
  const start = offset + 8;
  const end = start + getPayloadLength(header);
  return [header, resFile.subarray(start, end)];
}
