import type { ResourceMapPredicate } from './resource-map-predicate.js';
import type { ResourceMap } from '../models/resource-map.js';

export const joinResourcePredicates =
  (...predicates: ResourceMapPredicate[]): ResourceMapPredicate =>
  (it: ResourceMap) =>
    [...predicates].every((fn) => fn(it));
