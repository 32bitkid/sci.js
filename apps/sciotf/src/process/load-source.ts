import type { SourceSchemaType } from './schema.js';
import { type FontFace, parseFont, ResourceTypes } from '@4bitlabs/sci0';
import { findAndParseFont } from '../utils/find-and-parse.js';
import { readFile } from 'node:fs/promises';

export async function loadSource(source: SourceSchemaType): Promise<FontFace> {
  switch (source.type) {
    case 'resource': {
      return await findAndParseFont(
        source.root,
        source.id,
        source.engine ?? 'sci0',
      );
    }
    case 'patch': {
      const bytes = await readFile(source.path);
      if (bytes[0] !== (ResourceTypes.FONT_TYPE | 0x80)) {
        console.error(`warn: unexpected resource type ${bytes[0] ^ 0x80}`);
      }
      const payload = bytes.subarray(2);
      return parseFont(payload, { keyColor: 0x00, color: 0xff });
    }
  }
}
