import { computed, ref, shallowRef, unref } from 'vue';

import { DrawCommand } from '@4bitlabs/sci0';
import { insert } from '../helpers/array-helpers.ts';
import { EditorCommand } from '../models/EditorCommand.ts';

const nextId = () => Math.random().toString(36).substring(2);

const data: EditorCommand[] = [];

const layersRef = shallowRef<EditorCommand[]>(data);
const commandsRef = computed(() =>
  unref(layersRef).flatMap((it) => it.commands),
);
const selectedCommandIdx = ref<number | null>(null);
const topIdxRef = ref<number>(data.length - 1);

export default {
  get layers() {
    return unref(layersRef);
  },
  get commands() {
    return unref(commandsRef);
  },
  get cmdIdx() {
    return unref(selectedCommandIdx);
  },
  get topIdx() {
    return unref(topIdxRef);
  },
  set topIdx(n: number) {
    topIdxRef.value = n;
  },
};

const currentCommandRef = shallowRef<DrawCommand | null>(null);

export const currentCommandStore = {
  get current() {
    return unref(currentCommandRef);
  },
  set current(cmd: DrawCommand | null) {
    currentCommandRef.value = cmd;
  },
  get commands() {
    const cmd = unref(currentCommandRef);
    return cmd ? [cmd] : [];
  },
  commit() {
    const cmd = unref(currentCommandRef);
    if (cmd === null) return;
    currentCommandRef.value = null;
    layersRef.value = insert(layersRef.value, unref(topIdxRef) + 1, {
      id: nextId(),
      type: cmd[0],
      commands: [cmd],
    });
    topIdxRef.value += 1;
  },
  abort() {
    currentCommandRef.value = null;
  },
};
