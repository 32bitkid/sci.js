export const VIEW_TYPE: 0 = 0;
export const PIC_TYPE: 1 = 1;
export const SCRIPT_TYPE: 2 = 2;
export const TEXT_TYPE: 3 = 3;
export const SOUND_TYPE: 4 = 4;
export const MEMORY_TYPE: 5 = 5;
export const VOCAB_TYPE: 6 = 6;
export const FONT_TYPE: 7 = 7;
export const CURSOR_TYPE: 8 = 8;
export const PATCH_TYPE: 9 = 9;

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

export const ResourceTypes = {
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
};
