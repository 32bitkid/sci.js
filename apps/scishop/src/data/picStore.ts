import { computed, ref, shallowRef, unref } from 'vue';

import { DrawCommand } from '@4bitlabs/sci0';
import { insert } from '../helpers/array-helpers.ts';
import { EditorCommand } from '../models/EditorCommand.ts';

const nextId = () => Math.random().toString(36).substring(2);

const wrapRawCommand = (cmd: DrawCommand): EditorCommand =>
  ({ id: nextId(), type: cmd[0], commands: [cmd] }) as EditorCommand;

const refData: DrawCommand[] = [];

const data: EditorCommand[] = refData.map(wrapRawCommand);
export const layersRef = shallowRef<EditorCommand[]>(data);
export const selectedIdxRef = ref<number | null>(null);
export const topIdxRef = ref<number>(data.length);

export const currentRef = shallowRef<EditorCommand | null>(null);
export const currentCommandsRef = computed(() => {
  const current = unref(currentRef);
  return current ? [...current.commands] : [];
});

export const currentCommandStore = {
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
