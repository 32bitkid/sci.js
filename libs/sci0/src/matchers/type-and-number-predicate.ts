import type { ResourceType } from '../models/resource-type.js';
import type { ResourceMapPredicate } from './resource-map-predicate.js';
import { joinResourcePredicates } from './utils.js';
import { matchResourceNumber } from './number-predicate.js';

export const match = (
  criteria: {
    number?: number | number[];
    type?: ResourceType | ResourceType[];
  } = {},
): ResourceMapPredicate => {
  const predicates = [];
  if (criteria.number !== undefined) {
    const set = Array.isArray(criteria.number)
      ? criteria.number
      : [criteria.number];
    predicates.push(matchResourceNumber(...set));
  }

  if (criteria.type !== undefined) {
    const set = Array.isArray(criteria.type) ? criteria.type : [criteria.type];
    predicates.push(matchResourceNumber(...set));
  }

  return joinResourcePredicates(...predicates);
};
