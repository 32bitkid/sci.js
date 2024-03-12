export const VIEW_TYPE = 0 as const;
export const PIC_TYPE = 1 as const;
export const SCRIPT_TYPE = 2 as const;
export const TEXT_TYPE = 3 as const;
export const SOUND_TYPE = 4 as const;
export const MEMORY_TYPE = 5 as const;
export const VOCAB_TYPE = 6 as const;
export const FONT_TYPE = 7 as const;
export const CURSOR_TYPE = 8 as const;
export const PATCH_TYPE = 9 as const;

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
