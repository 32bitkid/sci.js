export type { ResourceHeader } from './models/resource-header';
export type { ResourceMap } from './models/resource-map';
export type { ResourceType } from './models/resource-type';
export type {
  PatternCode,
  DrawCodes,
  SetPaletteCommand,
  UpdatePaletteCommand,
  BrushCommand,
  FillCommand,
  PolylineCommand,
  EmbeddedCelCommand,
  DrawCommand,
} from './models/draw-command';
export { DrawMode } from './models/draw-command';

export {
  getResourceNumber,
  getResourceType,
  getResourceIdStr,
  getResourceTypeStr,
  isResourceType,
  isResourceNumber,
} from './models/resource-id';
export { ResourceTypes } from './models/resource-type';

export { renderPic, loopPaddingFilter } from './screen';

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

export { type Loop } from './models/view';
export { type Cel } from './models/cel';
export { type FontFace } from './models/font-face';

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
