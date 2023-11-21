import {
  getResourceNumber,
  getResourceType,
  ResourceMap,
  ResourceType,
  ResourceTypes,
} from '@4bitlabs/sci0';

export const createMatcher =
  (resType: ResourceType) =>
  (resId: number) =>
  ({ id }: ResourceMap) =>
    getResourceType(id) === resType && getResourceNumber(id) === resId;

export const picMatcher = createMatcher(ResourceTypes.PIC_TYPE);
