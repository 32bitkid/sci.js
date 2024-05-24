import { ref, shallowRef, unref } from 'vue';
import { identity, Matrix } from 'transformation-matrix';

import { DrawCommand } from '@4bitlabs/sci0';

export type Tool =
  | 'select'
  | 'pan'
  | 'line'
  | 'bezier'
  | 'rect'
  | 'oval'
  | 'brush'
  | 'fill';

const selectedToolRef = ref<Tool>('pan');
const selectedCommandIdx = ref<number | null>(null);
const cmdsRef = shallowRef<DrawCommand[]>([]);
const topIdxRef = ref<number>(data.length - 1);
const canvasSizeRef = ref<[number, number]>([320, 190]);
const aspectRatioRef = ref<number>(6 / 5);

const viewMatrixRef = shallowRef<Matrix>(identity());

export default {
  get selectedTool() {
    return unref(selectedToolRef);
  },
  set selectedTool(next: Tool) {
    selectedToolRef.value = next;
  },
  get canvasRes() {
    return canvasSizeRef;
  },
  get viewMatrix() {
    return viewMatrixRef;
  },
  get cmds() {
    return cmdsRef;
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
  get aspectRatio() {
    return unref(aspectRatioRef);
  },
  set aspectRatio(value: number) {
    aspectRatioRef.value = value;
  },
};
