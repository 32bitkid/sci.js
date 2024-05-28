import {
  Ref,
  computed,
  onMounted,
  ref,
  shallowRef,
  unref,
  watch,
  watchEffect,
  onUnmounted,
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
import { isInsideBounds, pixel } from '../helpers/polygons.ts';
import { useRafRef } from './useRafRef.ts';
import picStore, {
  currentCommandStore,
  currentCommandStore as cmdStore,
} from '../data/picStore.ts';
import { intVec2 } from '../helpers/vec2-helpers.ts';
import { drawState } from '../data/paletteStore.ts';
import { pixelBorder } from '../render/pixel-border.ts';
import { fillSkeleton } from '../render/fill-skeleton.ts';
import { plineSkeleton } from '../render/pline-skeleton.ts';
import { cursorDot } from '../render/cursor-dot.ts';

const clampZoom = (current: number, next: number, min: number, max: number) => {
  if (current * next < min) return min / current;
  if (current * next > max) return max / current;
  return next;
};

type CSSCursor = string;

export function useInputMachine(
  matrixRef: Ref<Matrix>,
  canvasRef: Ref<HTMLCanvasElement | null>,
  stageResRef: Ref<[number, number]>,
  canvasResRef: Ref<[number, number]>,
) {
  const iMatrixRef = computed(() => inverse(unref(matrixRef)));
  const dragStateRef = shallowRef<[Matrix, number, number] | null>(null);
  const currentCursorRef = ref<CSSCursor>('auto');

  const selectedLayerRef = computed(() => {
    const current = unref(currentCommandStore.current);
    if (current) return current;
    const selIdx = unref(picStore.selection);
    return selIdx !== null ? unref(picStore.layers)[selIdx] : null;
  });

  const cursorPositionRef = useRafRef<[number, number]>([0, 0]);
  const canvasPositionRef = computed<[number, number]>(() => {
    const sPos = unref(cursorPositionRef);
    const iMatrix = unref(iMatrixRef);
    return applyToPoint(iMatrix, sPos);
  });
  const canvasPixelRef = computed<[number, number]>((prev) => {
    const next = intVec2(unref(canvasPositionRef));
    const isSame = prev && prev[0] === next[0] && prev[1] === next[1];
    return isSame ? prev : next;
  });

  const isOverCanvasRef = computed<boolean>(() => {
    const canvasPoint = unref(canvasPositionRef);
    const [cWidth, cHeight] = unref(canvasResRef);
    return isInsideBounds([cWidth, cHeight], canvasPoint);
  });

  const isCursorHiddenRef = computed<boolean>(() => {
    const isTool = ['line', 'fill'].includes(toolbarStore.selectedTool);
    const isOverCanvas = unref(isOverCanvasRef);
    return isTool && isOverCanvas;
  });

  watchEffect(() => {
    const el = unref(canvasRef);
    if (!el) return;
    const hidden = unref(isCursorHiddenRef);
    const currentCursor = unref(currentCursorRef);
    el.style.cursor = hidden ? 'none' : currentCursor;
  });

  watch([cursorPositionRef, dragStateRef], ([[cX, cY], dragState]) => {
    if (!dragState) return;
    const [matrix, ix, iy] = dragState;
    const dx = ix - cX;
    const dy = iy - cY;
    viewStore.viewMatrix = compose(translate(-dx, -dy), matrix);
  });

  watch(
    [
      canvasRef,
      matrixRef,
      cursorPositionRef,
      canvasPositionRef,
      selectedLayerRef,
    ],
    ([el, matrix, screenPoint, canvasPoint, selectedLayer]) => {
      if (!el) return;

      const [sWidth, sHeight] = unref(stageResRef);
      el.width = sWidth;
      el.height = sHeight;
      const ctx = get2dContext(el);
      ctx.clearRect(0, 0, sWidth, sHeight);

      // Draw precision cursor
      if (
        toolbarStore.selectedTool === 'line' ||
        toolbarStore.selectedTool === 'fill'
      ) {
        // const canvasPoint = applyToPoint(iMatrix, screenPoint);

        const [cWidth, cHeight] = unref(canvasResRef);
        const overCanvas = isInsideBounds([cWidth, cHeight], canvasPoint);

        if (overCanvas) {
          ctx.save();
          pixelBorder(ctx, applyToPoints(matrix, pixel(canvasPoint, 0.0125)));
          ctx.restore();

          ctx.save();
          cursorDot(ctx, screenPoint);
          ctx.restore();
        }
      }

      if (selectedLayer) {
        ctx.save();
        ctx.lineWidth = 1.5;
        selectedLayer.commands.forEach((cmd) => {
          const [type] = cmd;
          ctx.strokeStyle = 'white';
          if (type === 'PLINE') {
            plineSkeleton(ctx, matrix, cmd);
          } else if (type === 'FILL') {
            fillSkeleton(ctx, matrix, cmd);
          }
        });
      }
    },
  );

  watch([canvasPixelRef], ([pos]) => {
    const current = cmdStore.current;
    if (current === null) return;
    if (current.type === 'PLINE') {
      const [type, mode, code, ...coords] = current.commands[0];
      cmdStore.begin({
        ...current,
        commands: [[type, mode, code, ...coords.slice(0, -1), pos]],
      });
    }
  });

  watchEffect(() => {
    const el = unref(canvasRef);
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
      if (toolbarStore.selectedTool === 'fill') {
        const pos = intVec2(
          applyToPoint(unref(iMatrixRef), [e.offsetX, e.offsetY]),
        );
        const [drawMode, ...drawCodes] = unref(drawState);
        picStore.selection = cmdStore.commit({
          id: Math.random().toString(36).substring(2),
          type: 'FILL',
          commands: [['FILL', drawMode, drawCodes, pos]],
        });
      } else if (toolbarStore.selectedTool === 'line') {
        const pos = intVec2(
          applyToPoint(unref(iMatrixRef), [e.offsetX, e.offsetY]),
        );

        const current = cmdStore.current;
        const [drawMode, ...drawCodes] = unref(drawState);
        if (current === null) {
          cmdStore.begin({
            id: Math.random().toString(36).substring(2),
            type: 'PLINE',
            commands: [['PLINE', drawMode, drawCodes, pos, pos]],
          });
        } else if (current.type === 'PLINE') {
          const [type, mode, code, ...coords] = current.commands[0];
          cmdStore.begin({
            ...current,
            commands: [
              [type, mode, code, ...coords.slice(0, -1), [...pos], [...pos]],
            ],
          });
        } else {
          throw new Error(`can't append to existing command ${current.type}`);
        }
      }
    },

    contextMenu: (e: MouseEvent) => {
      if (toolbarStore.selectedTool === 'line') {
        e.preventDefault();
        const current = cmdStore.current;
        if (current === null || current.type !== 'PLINE') return;

        const [type, mode, code, ...coords] = current.commands[0];
        if (coords.length < 3) {
          cmdStore.abort();
        } else {
          picStore.selection = cmdStore.commit({
            ...current,
            commands: [[type, mode, code, ...coords.slice(0, -1)]],
          });
        }
        return;
      }
    },

    wheel: (e: WheelEvent) => {
      const stage = unref(canvasRef);
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
    const el = unref(canvasRef);
    if (!el) return;
    el.addEventListener('click', mouseHandlers.click);
    el.addEventListener('contextmenu', mouseHandlers.contextMenu);
    el.addEventListener('wheel', mouseHandlers.wheel);
    el.addEventListener('pointerdown', pointerHandlers.down);
    el.addEventListener('pointermove', pointerHandlers.move);
    el.addEventListener('pointerup', pointerHandlers.up);
  });

  onUnmounted(() => {
    const el = unref(canvasRef);
    if (!el) return;
    el.removeEventListener('pointerup', pointerHandlers.up);
    el.removeEventListener('pointermove', pointerHandlers.move);
    el.removeEventListener('pointerdown', pointerHandlers.down);
    el.removeEventListener('wheel', mouseHandlers.wheel);
    el.removeEventListener('contextmenu', mouseHandlers.contextMenu);
    el.removeEventListener('click', mouseHandlers.click);
  });
}
