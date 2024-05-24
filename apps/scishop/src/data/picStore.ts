import { ref, shallowRef, unref } from 'vue';

import { DrawCommand } from '@4bitlabs/sci0';

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
