import { ref, shallowRef, unref } from 'vue';

import { DrawCommand } from '@4bitlabs/sci0';
import { insert } from '../helpers/array-helpers.ts';

const data: DrawCommand[] = [];

const layersRef = shallowRef<DrawCommand[]>(data);
const selectedCommandIdx = ref<number | null>(null);
const topIdxRef = ref<number>(data.length - 1);

export default {
  get layers() {
    return unref(layersRef);
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
  commit() {
    const cmd = unref(currentCommandRef);
    if (cmd === null) return;
    currentCommandRef.value = null;
    layersRef.value = insert(layersRef.value, unref(topIdxRef) + 1, cmd);
    topIdxRef.value += 1;
  },
  abort() {
    currentCommandRef.value = null;
  },
};
