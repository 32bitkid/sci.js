import { ResourceType, ResourceTypes } from '@4bitlabs/sci0';

export const resourceTypeName: Record<ResourceType, string> = {
  [ResourceTypes.VIEW_TYPE]: 'view',
  [ResourceTypes.PIC_TYPE]: 'pic',
  [ResourceTypes.SCRIPT_TYPE]: 'script',
  [ResourceTypes.TEXT_TYPE]: 'text',
  [ResourceTypes.SOUND_TYPE]: 'sound',
  [ResourceTypes.MEMORY_TYPE]: 'memory',
  [ResourceTypes.VOCAB_TYPE]: 'vocab',
  [ResourceTypes.FONT_TYPE]: 'font',
  [ResourceTypes.CURSOR_TYPE]: 'cursor',
  [ResourceTypes.PATCH_TYPE]: 'patch',
};
