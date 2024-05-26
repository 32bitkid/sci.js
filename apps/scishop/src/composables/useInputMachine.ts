import {
  Ref,
  computed,
  onMounted,
  ref,
  shallowRef,
  unref,
  watch,
  watchEffect,
} from 'vue';
import {
  applyToPoint,
  applyToPoints,
  compose,
  inverse,
  Matrix,
  rotateDEG,
  scale,
  translate,
} from 'transformation-matrix';

import toolbarStore from '../data/toolbarStore';
import viewStore from '../data/viewStore';
import { get2dContext } from '../helpers/getContext.ts';
import {
  isInsideBounds,
  pixel,
  areaOfPolygon,
  pathPoly,
} from '../helpers/polygons.ts';
import * as SmoothStep from '../helpers/smoothstep';
import { useRafRef } from './useRafRef.ts';
import { currentCommandStore as cmdStore } from '../data/picStore.ts';
import { intVec2 } from '../helpers/vec2-helpers.ts';

const clampZoom = (current: number, next: number, min: number, max: number) => {
  if (current * next < min) return min / current;
  if (current * next > max) return max / current;
  return next;
};

type CSSCursor = string;

export function useInputMachine(
  matrixRef: Ref<Matrix>,
  stageRef: Ref<HTMLCanvasElement | null>,
  stageResRef: Ref<[number, number]>,
  canvasResRef: Ref<[number, number]>,
) {
  const iMatrixRef = computed(() => inverse(unref(matrixRef)));
  const dragStateRef = shallowRef<[Matrix, number, number] | null>(null);
  const currentCursorRef = ref<CSSCursor>('auto');
  const cursorPositionRef = useRafRef<[number, number]>([0, 0]);

  const projected = computed<readonly [number, number]>((prev) => {
    const sPos = unref(cursorPositionRef);
    const next = intVec2(applyToPoint(unref(iMatrixRef), sPos));
    const isSame = prev && prev[0] === next[0] && prev[1] === next[1];
    return isSame ? prev : next;
  });

  watchEffect(() => {
    const el = unref(stageRef);
    if (!el) return;
    el.style.cursor = currentCursorRef.value;
  });

  watch([cursorPositionRef, dragStateRef], ([[cX, cY], dragState]) => {
    if (!dragState) return;

    const [matrix, ix, iy] = dragState;
    const dx = ix - cX;
    const dy = iy - cY;
    viewStore.viewMatrix = compose(translate(-dx, -dy), matrix);
  });

  watch(
    [stageRef, matrixRef, iMatrixRef, cursorPositionRef],
    ([el, matrix, iMatrix, screenPoint]) => {
      if (!el) return;

      const [sWidth, sHeight] = unref(stageResRef);
      el.width = sWidth;
      el.height = sHeight;
      const ctx = get2dContext(el);
      ctx.clearRect(0, 0, sWidth, sHeight);

      if (toolbarStore.selectedTool === 'line') {
        const canvasPoint = applyToPoint(iMatrix, screenPoint);

        const [cWidth, cHeight] = unref(canvasResRef);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        const overCanvas = isInsideBounds([cWidth, cHeight], canvasPoint);
        currentCursorRef.value = overCanvas ? 'none' : 'auto';
        if (overCanvas) {
          const pixelBounds = applyToPoints(matrix, pixel(canvasPoint, 0.0125));

          const area = areaOfPolygon(pixelBounds);
          const alpha = SmoothStep.s1(1, 6 * 6, area);
          ctx.save();
          pathPoly(ctx, pixelBounds);
          ctx.setLineDash([1, 1]);
          ctx.strokeStyle = `oklab(${(alpha * 100).toFixed(0)}% 0 0)`;
          ctx.fillStyle = `oklab(${(alpha * 100 * 0.45).toFixed(0)}% 0 0)`;
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(...screenPoint, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  );

  watch([projected], ([pos]) => {
    const current = cmdStore.current;
    if (current === null) return;
    if (current[0] === 'PLINE') {
      const [id, mode, code, ...coords] = current;
      cmdStore.current = [id, mode, code, ...coords.slice(0, -1), pos];
    }
  });

  watchEffect(() => {
    const el = unref(stageRef);
    if (!el) return;

    const stateState = unref(dragStateRef);
    const { selectedTool } = toolbarStore;

    if (stateState !== null) {
      currentCursorRef.value = 'grabbing';
    } else if (selectedTool === 'pan') {
      currentCursorRef.value = 'grab';
    } else if (selectedTool === 'select') {
      currentCursorRef.value = 'crosshair';
    } else {
      currentCursorRef.value = 'auto';
    }
  });

  const mouseHandlers = {
    click: (e: MouseEvent) => {
      console.log(e.button);
      if (toolbarStore.selectedTool === 'line') {
        const [x, y] = applyToPoint(unref(iMatrixRef), [e.offsetX, e.offsetY]);
        const pos: readonly [number, number] = [Math.floor(x), Math.floor(y)];

        const current = cmdStore.current;
        if (current === null) {
          cmdStore.current = [
            'PLINE',
            1,
            [Math.floor(Math.random() * 40), 0, 0],
            pos,
            pos,
          ];
        } else if (current[0] === 'PLINE') {
          const [id, mode, code, ...coords] = current;
          cmdStore.current = [id, mode, code, ...coords.slice(0, -1), pos, pos];
        } else {
          throw new Error(`can't append to existing command ${current[0]}`);
        }
      }
    },

    contextMenu: (e: MouseEvent) => {
      if (toolbarStore.selectedTool === 'line') {
        e.preventDefault();
        const current = cmdStore.current;
        if (current === null || current[0] !== 'PLINE') return;

        const [id, mode, code, ...coords] = current;
        if (coords.length < 3) {
          cmdStore.abort();
        } else {
          cmdStore.current = [id, mode, code, ...coords.slice(0, -1)];
          cmdStore.commit();
        }

        return;
      }
    },

    wheel: (e: WheelEvent) => {
      const stage = unref(stageRef);
      if (!stage) return;
      const [sWidth, sHeight] = unref(stageResRef);
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
    },
  };

  const pointerHandlers = {
    down: (e: PointerEvent) => {
      const isPanning =
        e.button === 1 ||
        (toolbarStore.selectedTool === 'pan' && e.button === 0);

      if (isPanning) {
        dragStateRef.value = [viewStore.viewMatrix, e.offsetX, e.offsetY];
      }
    },
    move: (e: PointerEvent) => {
      cursorPositionRef.value = [e.offsetX, e.offsetY];
    },
    up: () => {
      if (!dragStateRef.value) return;
      dragStateRef.value = null;
    },
  };

  onMounted(() => {
    const el = unref(stageRef);
    if (!el) return;

    el.addEventListener('click', mouseHandlers.click);
    el.addEventListener('contextmenu', mouseHandlers.contextMenu);
    el.addEventListener('wheel', mouseHandlers.wheel);
    el.addEventListener('pointerdown', pointerHandlers.down);
    el.addEventListener('pointermove', pointerHandlers.move);
    el.addEventListener('pointerup', pointerHandlers.up);
  });
}
