export type { ResourceMapPredicate } from './resource-map-predicate.js';

export { matchResourceNumber } from './number-predicate.js';
export { matchResourceType } from './type-predicates.js';
export { joinResourcePredicates } from './utils.js';

export {
  isViewPredicate,
  isPicPredicate,
  isScriptPredicate,
  isTextPredicate,
  isSoundPredicate,
  isMemoryPredicate,
  isVocabPredicate,
  isFontPredicate,
  isCursorPredicate,
  isPatchPredicate,
} from './type-predicates.js';

export { match } from './type-and-number-predicate.js';
