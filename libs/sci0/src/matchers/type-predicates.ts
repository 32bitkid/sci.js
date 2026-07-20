import type { ResourceMap } from '../models/resource-map.js';
import { getType } from '../models/resource-id.js';
import {
  CURSOR_TYPE,
  FONT_TYPE,
  MEMORY_TYPE,
  PATCH_TYPE,
  PIC_TYPE,
  SCRIPT_TYPE,
  SOUND_TYPE,
  TEXT_TYPE,
  VIEW_TYPE,
  VOCAB_TYPE,
} from '../models/resource-types.js';
import type { ResourceType } from '../models/resource-type.js';
import type { ResourceMapPredicate } from './resource-map-predicate.js';

export const matchResourceType =
  (...targets: ResourceType[]): ResourceMapPredicate =>
  (it: ResourceMap) =>
    [...targets].some((target) => getType(it.id) === target);

export const isViewPredicate: ResourceMapPredicate =
  matchResourceType(VIEW_TYPE);

export const isPicPredicate: ResourceMapPredicate = matchResourceType(PIC_TYPE);

export const isScriptPredicate: ResourceMapPredicate =
  matchResourceType(SCRIPT_TYPE);

export const isTextPredicate: ResourceMapPredicate =
  matchResourceType(TEXT_TYPE);

export const isSoundPredicate: ResourceMapPredicate =
  matchResourceType(SOUND_TYPE);

export const isMemoryPredicate: ResourceMapPredicate =
  matchResourceType(MEMORY_TYPE);

export const isVocabPredicate: ResourceMapPredicate =
  matchResourceType(VOCAB_TYPE);

export const isFontPredicate: ResourceMapPredicate =
  matchResourceType(FONT_TYPE);

export const isCursorPredicate: ResourceMapPredicate =
  matchResourceType(CURSOR_TYPE);

export const isPatchPredicate: ResourceMapPredicate =
  matchResourceType(PATCH_TYPE);
