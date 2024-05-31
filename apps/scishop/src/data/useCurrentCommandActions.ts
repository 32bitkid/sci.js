import { ShallowRef, Ref, unref } from 'vue';

import { EditorCommand } from '../models/EditorCommand.ts';
import { insert } from '../helpers/array-helpers.ts';

export function useCurrentCommandActions(deps: {
  layers: ShallowRef<EditorCommand[]>;
  current: ShallowRef<EditorCommand | null>;
  selectedIdx: Ref<number | null>;
  topIdx: Ref<number>;
}) {
  const {
    layers: layersRef,
    current: currentRef,
    selectedIdx: selectedIdxRef,
    topIdx: topIdxRef,
  } = deps;

  return {
    begin(cmd: EditorCommand) {
      currentRef.value = cmd;
    },
    commit(cmd: EditorCommand) {
      currentRef.value = null;
      const insertPosition = unref(topIdxRef);
      layersRef.value = insert(layersRef.value, insertPosition, cmd);
      topIdxRef.value += 1;
      selectedIdxRef.value = insertPosition;
    },
    abort() {
      currentRef.value = null;
    },
  };
}
