import {
  Resource,
  ResourceTypes,
  type ResourceMap,
  type ResourceType,
} from '@4bitlabs/sci0';
import type { ResourceMapPredicate } from '../actions/load-content-from-map';

export const createMatcherForType =
  (resType: ResourceType) =>
  (resId: number): ResourceMapPredicate =>
  ({ id }: ResourceMap) =>
    Resource.getType(id) === resType && Resource.getNumber(id) === resId;

export const picMatcher = createMatcherForType(ResourceTypes.PIC_TYPE);
export const viewMatcher = createMatcherForType(ResourceTypes.VIEW_TYPE);
export const fontMatcher = createMatcherForType(ResourceTypes.FONT_TYPE);
export const cursorMatcher = createMatcherForType(ResourceTypes.CURSOR_TYPE);
