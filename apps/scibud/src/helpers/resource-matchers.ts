import {
  getResourceNumber,
  getResourceType,
  ResourceTypes,
  type ResourceMap,
  type ResourceType,
} from '@4bitlabs/sci0';
import { type ResourceMapPredicate } from '../actions/load-content-from-map';

export const matchById =
  (resId: number): ResourceMapPredicate =>
  ({ id }: ResourceMap) =>
    getResourceNumber(id) === resId;

export const createMatcherForType =
  (resType: ResourceType) =>
  (resId: number): ResourceMapPredicate =>
  ({ id }: ResourceMap) =>
    getResourceType(id) === resType && getResourceNumber(id) === resId;

export const picMatcher = createMatcherForType(ResourceTypes.PIC_TYPE);
export const viewMatcher = createMatcherForType(ResourceTypes.VIEW_TYPE);
