import { computed, ref, shallowRef, unref } from 'vue';
import {
  compose,
  Matrix,
  rotate,
  scale,
  translate,
} from 'transformation-matrix';

import { DrawCommand } from '@4bitlabs/sci0';

export type Tool =
  | 'pan'
  | 'line'
  | 'bezier'
  | 'rect'
  | 'oval'
  | 'brush'
  | 'fill';

const selectedToolRef = ref<Tool>('pan');
const cmdIdx = ref<number>(0);
const cmdsRef = shallowRef<DrawCommand[]>([]);
const canvasResRef = ref<[number, number]>([320, 190]);
const viewMatrixRef = ref<Matrix>(
  compose(
    rotate(-0 * (Math.PI / 180)),
    scale(2.0, 2.0),
    scale(1, 6 / 5),
    translate(-35, 0),
  ),
);

export default {
  get selectedTool() {
    return unref(selectedToolRef);
  },
  set selectedTool(next: Tool) {
    selectedToolRef.value = next;
  },
  get canvasRes() {
    return canvasResRef;
  },
  get viewMatrix() {
    return viewMatrixRef;
  },
  get cmds() {
    return cmdsRef;
  },
  get cmdIdx() {
    return unref(cmdIdx);
  },
  set cmdIdx(idx: number) {
    cmdIdx.value = Math.min(Math.max(0, idx), cmdsRef.value.length);
  },
};
