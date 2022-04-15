import {
  getResourceNumber,
  getResourceType,
  ResourceMap,
  ResourceType,
} from '@4bitlabs/sci0';

export const createMatcher =
  (resType: ResourceType) =>
  (resId: number) =>
  ({ id }: ResourceMap) =>
    getResourceType(id) === resType && getResourceNumber(id) === resId;

export const picMatcher = createMatcher(ResourceType.PIC);
