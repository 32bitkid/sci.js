import {
  Ref,
  computed,
  onMounted,
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

import { round, isEqual, vec2 } from '@4bitlabs/vec2';
import { FillCommand, PolylineCommand } from '@4bitlabs/sci0';
import toolbarStore from '../data/toolbarStore';
import viewStore from '../data/viewStore';
import { get2dContext } from '../helpers/getContext.ts';
import { isInsideBounds, pixel } from '../helpers/polygons.ts';
import { useRafRef } from './useRafRef.ts';
import picStore, {
  currentCommandStore,
  currentCommandStore as cmdStore,
  layersRef,
} from '../data/picStore.ts';
import { drawState } from '../data/paletteStore.ts';
import { pixelBorder } from '../render/pixel-border.ts';
import { fillSkeleton } from '../render/fill-skeleton.ts';
import { plineSkeleton } from '../render/pline-skeleton.ts';
import { cursorDot } from '../render/cursor-dot.ts';
import {
  moveFillVertex,
  moveLineVertex,
  nearestPointWithRange,
} from '../helpers/command-helpers.ts';
import { insert } from '../helpers/array-helpers.ts';
import { BasicEditorCommand } from '../models/EditorCommand.ts';

const clampZoom = (current: number, next: number, min: number, max: number) => {
  if (current * next < min) return min / current;
  if (current * next > max) return max / current;
  return next;
};

// TODO collapse
type ViewDragState = ['view', Matrix, number, number];
type PointDragState = [
  'point',
  layerIdx: number,
  cmdIdx: number,
  vertexIdx: number,
];

export function useInputMachine(
  matrixRef: Ref<Matrix>,
  canvasRef: Ref<HTMLCanvasElement | null>,
  stageResRef: Ref<[number, number]>,
  canvasResRef: Ref<[number, number]>,
) {
  const iMatrixRef = computed(() => inverse(unref(matrixRef)));
  const dragStateRef = shallowRef<ViewDragState | PointDragState | null>(null);

  const selectedLayerRef = computed(() => {
    const current = unref(currentCommandStore.current);
    if (current) return current;
    const selIdx = unref(picStore.selection);
    return selIdx !== null ? unref(picStore.layers)[selIdx] : null;
  });

  const cursorPositionRef = useRafRef<[number, number]>([0, 0]);
  const canvasPositionRef = computed<[number, number]>(() =>
    applyToPoint(unref(iMatrixRef), unref(cursorPositionRef)),
  );
  const canvasPixelRef = computed<[number, number]>((prev) => {
    const next = round(unref(canvasPositionRef), vec2(), Math.floor);
    const isSame = prev && isEqual(prev, next);
    return isSame ? prev : next;
  });

  const isOverCanvasRef = computed<boolean>(() => {
    const canvasPoint = unref(canvasPixelRef);
    const [cWidth, cHeight] = unref(canvasResRef);
    return isInsideBounds([cWidth, cHeight], canvasPoint);
  });

  watchEffect(() => {
    const el = unref(canvasRef);
    if (!el) return;

    const dragState = unref(dragStateRef);
    const { selectedTool } = toolbarStore;

    let currentCursor = 'auto';
    if (dragState !== null && dragState[0] === 'view') {
      currentCursor = 'grabbing';
    } else if (selectedTool === 'pan') {
      currentCursor = 'grab';
    } else if (selectedTool === 'select') {
      currentCursor = 'crosshair';
    } else if (['line', 'fill'].includes(selectedTool)) {
      const isOverCanvas = unref(isOverCanvasRef);
      if (isOverCanvas) currentCursor = 'none';
    }

    el.style.cursor = currentCursor;
  });

  // Apply current pan state
  watch([cursorPositionRef, dragStateRef], ([[cX, cY], dragState]) => {
    if (!dragState) return;
    const [mode] = dragState;
    if (mode !== 'view') return;

    const [, matrix, ix, iy] = dragState;
    const dx = ix - cX;
    const dy = iy - cY;
    viewStore.viewMatrix = compose(translate(-dx, -dy), matrix);
  });

  // Apply point drag state
  watch([canvasPixelRef, dragStateRef], ([pos, dragState]) => {
    if (!dragState) return;
    const [mode] = dragState;
    if (mode !== 'point') return;

    const [, lIdx, cIdx, pIdx] = dragState;
    const layer = unref(picStore.layers)[lIdx];
    if (layer.type === 'PLINE') {
      const cmd = layer.commands[cIdx];
      const next: BasicEditorCommand<PolylineCommand> = {
        ...layer,
        commands: [moveLineVertex(cmd, pIdx, pos)],
      };
      layersRef.value = insert(picStore.layers, lIdx, next, true);
      return;
    }

    if (layer.type === 'FILL') {
      const cmd = layer.commands[cIdx];
      const next: BasicEditorCommand<FillCommand> = {
        ...layer,
        commands: [moveFillVertex(cmd, pos)],
      };
      layersRef.value = insert(picStore.layers, lIdx, next, true);
      return;
    }
  });

  // Update the UI canvas
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

        const found = nearestPointWithRange(
          selectedLayer.commands,
          canvasPoint,
          Math.max(0.404, 7.5 / viewStore.zoom),
        );

        selectedLayer.commands.forEach((cmd, idx) => {
          const [type] = cmd;
          ctx.strokeStyle = 'white';
          ctx.fillStyle = '#999';
          if (type === 'PLINE') {
            const highlight = found?.[0] == idx ? [found[1]] : [];
            plineSkeleton(ctx, matrix, cmd, highlight);
          }

          if (type === 'FILL') {
            const highlight = found?.[0] === idx;
            fillSkeleton(ctx, matrix, cmd, highlight);
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

  const mouseHandlers = {
    click: (e: MouseEvent) => {
      if (toolbarStore.selectedTool === 'fill') {
        const pos = round(
          applyToPoint(unref(iMatrixRef), [e.offsetX, e.offsetY]),
          vec2(),
          Math.floor,
        );
        const [drawMode, ...drawCodes] = unref(drawState);
        picStore.selection = cmdStore.commit({
          id: Math.random().toString(36).substring(2),
          type: 'FILL',
          commands: [['FILL', drawMode, drawCodes, pos]],
        });
        return;
      }

      if (toolbarStore.selectedTool === 'line') {
        const pos = round(
          applyToPoint(unref(iMatrixRef), [e.offsetX, e.offsetY]),
          vec2(),
          Math.floor,
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
      const { selectedTool } = toolbarStore;
      if (selectedTool === 'line') {
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

      if (selectedTool === 'select') {
        e.preventDefault();
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
      if (dragStateRef.value !== null) return; // already panning

      const { selectedTool } = toolbarStore;
      const isPanning =
        (selectedTool === 'pan' && e.button === 0) || e.button === 1;
      if (isPanning) {
        dragStateRef.value = [
          'view',
          viewStore.viewMatrix,
          e.offsetX,
          e.offsetY,
        ];
        return;
      }

      if (selectedTool === 'select' && e.button === 0) {
        // check if is within radius of any point of the selected layer
        const selIdx = unref(picStore.selection);
        if (selIdx === null) return;

        const layer = unref(picStore.layers)[selIdx];
        if (!layer) return;

        const cPos = unref(canvasPositionRef);
        const found = nearestPointWithRange(
          layer.commands,
          cPos,
          Math.max(0.5, 7 / viewStore.zoom),
        );
        if (!found) return;
        const [cIdx, pIdx] = found;
        dragStateRef.value = ['point', selIdx, cIdx, pIdx];
      }
    },
    move: (e: PointerEvent) => {
      cursorPositionRef.value = [e.offsetX, e.offsetY];
    },
    up: () => {
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
