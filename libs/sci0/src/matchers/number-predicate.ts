import type { ResourceMap } from '../models/resource-map.js';
import { getNumber } from '../models/resource-id.js';
import type { ResourceMapPredicate } from './resource-map-predicate.js';

export const matchResourceNumber =
  (...targets: number[]): ResourceMapPredicate =>
  (it: ResourceMap) =>
    [...targets].some((target) => getNumber(it.id) === target);
