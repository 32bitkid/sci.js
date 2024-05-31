import { Ref, type ShallowRef, unref } from 'vue';

import { EditorCommand } from '../models/EditorCommand.ts';
import { insert, remove } from '../helpers/array-helpers.ts';

export function useUpdateSelectionFn(deps: {
  layers: ShallowRef<EditorCommand[]>;
  topIdx: Ref<number>;
  selectedIdx: Ref<number | null>;
}) {
  const { layers, topIdx, selectedIdx } = deps;
  return function updateSelection(
    updateFn: (it: EditorCommand) => EditorCommand | null,
  ): boolean {
    const idx = unref(selectedIdx);
    if (idx === null) return false;

    const cmd = layers.value[idx];
    if (!cmd) return false;

    const next = updateFn(cmd);
    if (next === null) {
      layers.value = remove(layers.value, idx);
      selectedIdx.value = null;
      if (idx < unref(topIdx)) topIdx.value -= 1;
    } else {
      layers.value = insert(layers.value, idx, next, true);
    }

    return true;
  };
}
