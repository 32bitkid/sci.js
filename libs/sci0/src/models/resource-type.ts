import type {
  VIEW_TYPE,
  PIC_TYPE,
  SCRIPT_TYPE,
  TEXT_TYPE,
  SOUND_TYPE,
  MEMORY_TYPE,
  VOCAB_TYPE,
  FONT_TYPE,
  CURSOR_TYPE,
  PATCH_TYPE,
} from './resource-types';

export type ResourceType =
  | typeof VIEW_TYPE
  | typeof PIC_TYPE
  | typeof SCRIPT_TYPE
  | typeof TEXT_TYPE
  | typeof SOUND_TYPE
  | typeof MEMORY_TYPE
  | typeof VOCAB_TYPE
  | typeof FONT_TYPE
  | typeof CURSOR_TYPE
  | typeof PATCH_TYPE;
