import {
  parseAllMappings,
  parseHeaderWithPayload,
  type ResourceHeader,
  type ResourceMap,
} from '@4bitlabs/sci0';
import { readFile } from '../helpers/read-file';

export type ResourceMapPredicate = ({ id }: ResourceMap) => boolean;

export async function loadContentFromMap(
  root: string,
  matcher: ResourceMapPredicate,
): Promise<[ResourceHeader, Uint8Array]> {
  const mapping = parseAllMappings(await readFile(root, 'RESOURCE.MAP'));
  const match = mapping.find(matcher);

  if (!match) {
    throw new Error(`error: resource cannot be matched!`);
  }

  const { offset, file } = match;
  const resFilename = `RESOURCE.${file.toString().padStart(3, '0')}`;

  const resFile = await readFile(root, resFilename);
  return parseHeaderWithPayload(resFile, offset);
}
