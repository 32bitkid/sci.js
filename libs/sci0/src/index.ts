export type { ResourceHeader } from './models/resource-header';
export type { ResourceMap } from './models/resource-map';
export type { ResourceType } from './models/resource-type';
export type {
  PatternCode,
  DrawCodes,
  DrawCommandStruct,
  SetPaletteCommand,
  UpdatePaletteCommand,
  BrushCommand,
  FillCommand,
  PolylineCommand,
  EmbeddedCelCommand,
  DrawCommand,
} from './models/draw-command';
export {
  DrawMode,
  isVisualMode,
  isPriorityMode,
  isControlMode,
} from './models/draw-command';

export {
  getResourceNumber,
  getResourceType,
  getResourceIdStr,
  getResourceTypeStr,
  isResourceType,
  isResourceNumber,
} from './models/resource-id';
export * as ResourceTypes from './models/resource-types';

export type { RenderResult } from './screen/render-result';
export { renderPic, generatePic, loopPaddingFilter } from './screen';

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
