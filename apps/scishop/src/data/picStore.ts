import { ref, shallowRef, unref } from 'vue';

import { DrawCommand } from '@4bitlabs/sci0';
import { insert, remove } from '../helpers/array-helpers.ts';
import { EditorCommand } from '../models/EditorCommand.ts';

const nextId = () => Math.random().toString(36).substring(2);

const wrapRawCommand = (cmd: DrawCommand): EditorCommand =>
  ({ id: nextId(), type: cmd[0], commands: [cmd] }) as EditorCommand;

const refData: DrawCommand[] = [];

const data: EditorCommand[] = refData.map(wrapRawCommand);
export const layersRef = shallowRef<EditorCommand[]>(data);
const selectedCommandIdx = ref<number | null>(null);
const topIdxRef = ref<number>(data.length);

export default {
  get layers() {
    return unref(layersRef);
  },
  get selection() {
    return unref(selectedCommandIdx);
  },
  set selection(it: number | null) {
    selectedCommandIdx.value = it;
  },
  get topIdx() {
    return unref(topIdxRef);
  },
  set topIdx(n: number) {
    topIdxRef.value = n;
  },

  updateSelection(
    updateFn: (it: EditorCommand) => EditorCommand | null,
  ): boolean {
    const idx = unref(selectedCommandIdx);
    if (idx === null) return false;

    const cmd = layersRef.value[idx];
    if (!cmd) return false;

    const next = updateFn(cmd);
    if (next === null) {
      layersRef.value = remove(layersRef.value, idx);
      this.selection = null;
      if (idx < this.topIdx) this.topIdx -= 1;
    } else {
      layersRef.value = insert(layersRef.value, idx, next, true);
    }

    return true;
  },
};

const currentCommandRef = shallowRef<EditorCommand | null>(null);

export const currentCommandStore = {
  get current() {
    return unref(currentCommandRef);
  },
  get commands() {
    const cmd = unref(currentCommandRef);
    return cmd ? [...cmd.commands] : [];
  },
  begin(cmd: EditorCommand) {
    currentCommandRef.value = cmd;
  },
  commit(cmd: EditorCommand): number {
    currentCommandRef.value = null;
    const insertPosition = unref(topIdxRef);
    layersRef.value = insert(layersRef.value, insertPosition, cmd);
    topIdxRef.value += 1;
    return insertPosition;
  },
  abort() {
    currentCommandRef.value = null;
  },
};
