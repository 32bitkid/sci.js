export type { ResourceHeader } from './models/resource-header';
export type { ResourceMap } from './models/resource-map';
export type { ResourceType } from './models/resource-type';
export type { DrawCommand } from './models/draw-command';

export {
  getResourceNumber,
  getResourceType,
  getResourceIdStr,
  getResourceTypeStr,
  isResourceType,
  isResourceNumber,
} from './models/resource-id';
export { ResourceTypes } from './models/resource-type';

export { renderPic } from './screen';

export {
  parseAll as parseAllMappings,
  consume as consumeNextMappingChunk,
} from './parsers/mapping';
export { getPayloadLength, parseHeaderFrom } from './parsers/resource-header';
export { decompress } from './parsers/compression';
import { parseFrom as parseCursor } from './parsers/cursor';
import { parseFrom as parseFont } from './parsers/font';
import { parseFrom as parseView } from './parsers/view';
import { parseFrom as parsePic } from './parsers/pic';

export { parseCursor, parseFont, parseView, parsePic };

/** @deprecated use parseCursor() instead */
export const Cursor = {
  parseFrom: parseCursor,
};

/** @deprecated use parseFont() instead */
export const Font = {
  parseFrom: parseFont,
};

/** @deprecated use parseView() instead */
export const View = {
  parseFrom: parseView,
};

/** @deprecated use parsePic() instead */
export const Pic = {
  parseFrom: parsePic,
};
