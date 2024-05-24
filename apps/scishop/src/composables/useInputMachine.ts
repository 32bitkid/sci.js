import { computed, onMounted, unref, Ref } from 'vue';
import {
  applyToPoint,
  compose,
  inverse,
  Matrix,
  rotateDEG,
  scale,
  translate,
} from 'transformation-matrix';

import toolbarStore from '../data/toolbarStore';
import viewStore from '../data/viewStore';

const clampZoom = (current: number, next: number, min: number, max: number) => {
  if (current * next < min) return min / current;
  if (current * next > max) return max / current;
  return next;
};

export function useInputMachine(
  matrixRef: Ref<Matrix>,
  stageRef: Ref<HTMLCanvasElement | null>,
) {
  const iMatrixRef = computed(() => inverse(unref(matrixRef)));

  onMounted(() => {
    const el = unref(stageRef);
    if (!el) return;

    el.addEventListener('click', (e) => {
      if (toolbarStore.selectedTool === 'line') {
        const iMatrix = unref(iMatrixRef);
        const screenPos: [number, number] = [e.offsetX, e.offsetY];
        const [x, y] = applyToPoint(iMatrix, screenPos);
        console.log('line:', x, y);
        // const cmd = unref(store.selectedCmd);
        // if (cmd[0] === 'PLINE') {
        //   store.cmds.value.splice(
        //     store.cmds.value.length - store.cmdIdx - 1,
        //     1,
        //     [...cmd, [Math.floor(x), Math.floor(y)]],
        //   );
        //   triggerRef(store.cmds);
        //   console.log('appending');
        // }
      }
    });

    el.addEventListener('wheel', (e) => {
      const stage = unref(stageRef);
      if (!stage) return;
      const { width: sWidth, height: sHeight } = stage;
      const [dx, dy] = [e.offsetX - sWidth / 2, e.offsetY - sHeight / 2];
      const scaleFactor = clampZoom(
        viewStore.zoom,
        e.deltaY / 1000 + 1,
        0.5,
        100,
      );
      viewStore.viewMatrix = compose(
        translate(dx, dy),
        scale(scaleFactor),
        rotateDEG(-e.deltaX / 40),
        translate(-dx, -dy),
        viewStore.viewMatrix,
      );
    });

    let dragState: [Matrix, number, number] | null = null;
    el.addEventListener('pointerdown', (e) => {
      if (e.button === 1) {
        el.style.cursor = 'grabbing';
        dragState = [viewStore.viewMatrix, e.offsetX, e.offsetY];
      }
    });

    el.addEventListener('pointermove', (e) => {
      if (!dragState) return;
      const [matrix, ix, iy] = dragState;
      const dx = ix - e.offsetX;
      const dy = iy - e.offsetY;
      viewStore.viewMatrix = compose(translate(-dx, -dy), matrix);
    });

    el.addEventListener('pointerup', () => {
      if (!dragState) return;
      el.style.cursor = '';
      dragState = null;
    });
  });
}
