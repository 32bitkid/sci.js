import { unref } from 'vue';

import { EditorCommand } from '../models/EditorCommand.ts';
import { insert, remove } from '../helpers/array-helpers.ts';
import { layersRef, selectedIdxRef, topIdxRef } from './picStore.ts';

export function updateSelection(
  updateFn: (it: EditorCommand) => EditorCommand | null,
): boolean {
  const idx = unref(selectedIdxRef);
  if (idx === null) return false;

  const cmd = layersRef.value[idx];
  if (!cmd) return false;

  const next = updateFn(cmd);
  if (next === null) {
    layersRef.value = remove(layersRef.value, idx);
    selectedIdxRef.value = null;
    if (idx < unref(topIdxRef)) topIdxRef.value -= 1;
  } else {
    layersRef.value = insert(layersRef.value, idx, next, true);
  }

  return true;
}
