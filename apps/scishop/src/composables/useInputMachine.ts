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

import store from '../data/store.ts';

export function useInputMachine(
  matrixRef: Ref<Matrix>,
  stageRef: Ref<HTMLCanvasElement | null>,
) {
  const iMatrixRef = computed(() => inverse(unref(matrixRef)));

  onMounted(() => {
    const el = unref(stageRef);
    if (!el) return;

    el.addEventListener('click', (e) => {
      if (store.selectedTool === 'line') {
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

      store.viewMatrix.value = compose(
        translate(dx, dy),
        scale(Math.max(0, e.deltaY / 1000 + 1)),
        rotateDEG(-e.deltaX / 40),
        translate(-dx, -dy),
        store.viewMatrix.value,
      );
    });

    let dragState: [Matrix, number, number] | null = null;
    el.addEventListener('pointerdown', (e) => {
      if (e.button === 1) {
        el.style.cursor = 'grabbing';
        dragState = [store.viewMatrix.value, e.offsetX, e.offsetY];
      }
    });

    el.addEventListener('pointermove', (e) => {
      if (!dragState) return;
      const [matrix, ix, iy] = dragState;
      const dx = ix - e.offsetX;
      const dy = iy - e.offsetY;
      store.viewMatrix.value = compose(translate(-dx, -dy), matrix);
    });

    el.addEventListener('pointerup', () => {
      if (!dragState) return;
      el.style.cursor = '';
      dragState = null;
    });
  });
}
