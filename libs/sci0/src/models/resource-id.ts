import { ResourceType } from './resource-type';
import * as ResourceTypes from './resource-type';

export const getResourceType = (id: number): ResourceType =>
  (id >>> 11) as ResourceType;

export const getResourceNumber = (id: number): number => id & 0b111_1111_1111;

export const getResourceIdStr = (id: number) =>
  `(${getResourceTypeStr(id)}:${getResourceNumber(id)})`;

export const getResourceTypeStr = (id: number) => {
  const type = getResourceType(id);
  switch (type) {
    case ResourceTypes.VIEW_TYPE:
      return 'View';
    case ResourceTypes.PIC_TYPE:
      return 'Pic';
    case ResourceTypes.SCRIPT_TYPE:
      return 'Script';
    case ResourceTypes.TEXT_TYPE:
      return 'Text';
    case ResourceTypes.SOUND_TYPE:
      return 'Sound';
    case ResourceTypes.MEMORY_TYPE:
      return 'Memory';
    case ResourceTypes.VOCAB_TYPE:
      return 'Vocab';
    case ResourceTypes.FONT_TYPE:
      return 'Font';
    case ResourceTypes.CURSOR_TYPE:
      return 'Cursor';
    case ResourceTypes.PATCH_TYPE:
      return 'Patch';
    default:
      throw new Error(`Unsupported resource type: ${type}`);
  }
};

type ResourceIdPredicate = (it: number) => boolean;

export const isResourceType =
  (...types: ResourceType[]): ResourceIdPredicate =>
  (it: number): boolean =>
    types.includes(getResourceType(it));

export const isResourceNumber =
  (...numbers: number[]): ResourceIdPredicate =>
  (it: number): boolean =>
    numbers.includes(getResourceNumber(it));
