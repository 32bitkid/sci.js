import { exhaustive } from '../utils/exhaustive';
import { ResourceType } from './resource-type';
import {
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

export const getResourceType = (id: number): ResourceType =>
  (id >>> 11) as ResourceType;

export const getResourceNumber = (id: number): number => id & 0b111_1111_1111;

export const getResourceIdStr = (id: number) =>
  `(${getResourceTypeStr(id)}:${getResourceNumber(id).toString(10)})`;

export const getResourceTypeStr = (id: number): string => {
  const type = getResourceType(id);
  switch (type) {
    case VIEW_TYPE:
      return 'View';
    case PIC_TYPE:
      return 'Pic';
    case SCRIPT_TYPE:
      return 'Script';
    case TEXT_TYPE:
      return 'Text';
    case SOUND_TYPE:
      return 'Sound';
    case MEMORY_TYPE:
      return 'Memory';
    case VOCAB_TYPE:
      return 'Vocab';
    case FONT_TYPE:
      return 'Font';
    case CURSOR_TYPE:
      return 'Cursor';
    case PATCH_TYPE:
      return 'Patch';
    default:
      exhaustive('Unsupported resource type', type);
  }
};
