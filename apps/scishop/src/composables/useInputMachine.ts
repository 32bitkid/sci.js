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
import deepEqual from 'fast-deep-equal';

import { round, isEqual, vec2, Vec2, sub, add } from '@4bitlabs/vec2';
import { FillCommand, PolylineCommand } from '@4bitlabs/sci0';
import toolbarStore from '../data/toolbarStore';
import viewStore from '../data/viewStore';
import { get2dContext } from '../helpers/getContext.ts';
import {
  isInsideBounds,
  isInsidePolygon,
  pathPoly,
  pixel,
  rect,
} from '../helpers/polygons.ts';
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
import {
  extractVertices,
  FindResult,
  moveFillVertex,
  moveLineVertex,
  mustGetVertexFrom,
  nearestPointWithRange,
  PointAlongPathResult,
  pointAlongPaths,
} from '../helpers/command-helpers.ts';
import { insert, remove } from '../helpers/array-helpers.ts';
import { BasicEditorCommand } from '../models/EditorCommand.ts';
import cursorPenSvg from '../assets/cursor-pen.svg';
import cursorPenStarSvg from '../assets/cursor-pen-star.svg';
import cursorPenPlusSvg from '../assets/cursor-pen-plus.svg';
import cursorPenMinusSvg from '../assets/cursor-pen-minus.svg';
import { setCanvasDimensions } from '../helpers/setCanvasDimensions.ts';
import { cursorDot } from '../render/cursor-dot.ts';
import { pointSkeleton } from '../render/point-skeleton.ts';

const clampZoom = (current: number, next: number, min: number, max: number) => {
  if (current * next < min) return min / current;
  if (current * next > max) return max / current;
  return next;
};

type SelectionEntry = [layerIdx: number, cmdIdx: number, vertexIdx: number];

type ViewDragState = ['view', iMatrix: Matrix, iPosition: Vec2];
type PointDragState = [
  'point',
  iPosition: Vec2,
  ...[...SelectionEntry, initial: Vec2][],
];
type SelectionDragState = ['sel-rect', start: Vec2];

type DragStates = ViewDragState | PointDragState | SelectionDragState;

const selectedLayerRef = computed(() => {
  const selIdx = unref(picStore.selection);
  return selIdx !== null ? unref(picStore.layers)[selIdx] : null;
});

const activeLayerRef = computed(() => {
  const current = unref(currentCommandStore.current);
  if (current) return current;
  return unref(selectedLayerRef);
});

const pointerRadiusRef = computed(() => Math.max(0.404, 7.5 / viewStore.zoom));

export function useInputMachine(
  matrixRef: Ref<Matrix>,
  canvasRef: Ref<HTMLCanvasElement | null>,
  selCanvasRef: Ref<HTMLCanvasElement | null>,
  cursorCanvasRef: Ref<HTMLCanvasElement | null>,
  stageResRef: Ref<[number, number]>,
  canvasResRef: Ref<[number, number]>,
) {
  const iMatrixRef = computed(() => inverse(unref(matrixRef)));
  const dragStateRef = shallowRef<DragStates | null>(null);
  const selectionStateRef = shallowRef<SelectionEntry[]>([]);

  const lastCursorPositionRef = useRafRef<[number, number]>([0, 0]);
  const canvasPositionRef = computed<[number, number]>((prev = vec2()) => {
    const actual = applyToPoint(
      unref(iMatrixRef),
      unref(lastCursorPositionRef),
    );
    const next = round(actual, vec2(), (i) => Math.floor(i * 8) / 8);
    return isEqual(prev, next) ? prev : next;
  });

  const canvasPixelRef = computed<[number, number]>((prev = vec2()) => {
    const next = round(unref(canvasPositionRef), vec2(), Math.floor);
    return isEqual(prev, next) ? prev : next;
  });

  const isOverCanvasRef = computed<boolean>(() => {
    const canvasPoint = unref(canvasPixelRef);
    const [cWidth, cHeight] = unref(canvasResRef);
    return isInsideBounds([cWidth, cHeight], canvasPoint);
  });

  const nearestExistingPointRef = computed<FindResult | null>((prev = null) => {
    const cmds = unref(selectedLayerRef)?.commands;
    if (!cmds || cmds.length < 1) return null;

    const cPos = unref(canvasPositionRef);
    const radius = unref(pointerRadiusRef);
    const next = nearestPointWithRange(cmds, cPos, radius);

    return deepEqual(prev, next) ? prev : next;
  });

  const nearestAddPointRef = computed<PointAlongPathResult | null>(
    (prev = null) => {
      const cmds = unref(selectedLayerRef)?.commands;
      if (!cmds || cmds.length < 1) return null;

      const cPos = unref(canvasPositionRef);
      const radius = unref(pointerRadiusRef);
      const next = pointAlongPaths(cmds, cPos, radius);

      return deepEqual(prev, next) ? prev : next;
    },
  );

  // Cursor updater
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
    } else if (selectedTool == 'line') {
      const isOverCanvas = unref(isOverCanvasRef);
      if (isOverCanvas) {
        if (unref(currentCommandStore.current)) {
          currentCursor = `url(${cursorPenSvg}) 0 0, none`;
        } else if (unref(nearestExistingPointRef) !== null) {
          currentCursor = `url(${cursorPenMinusSvg}) 0 0, none`;
        } else if (unref(nearestAddPointRef) !== null) {
          currentCursor = `url(${cursorPenPlusSvg}) 0 0, none`;
        } else {
          currentCursor = `url(${cursorPenStarSvg}) 0 0, none`;
        }
      }
    }
    el.style.cursor = currentCursor;
  });

  // Apply current pan state
  watch([lastCursorPositionRef, dragStateRef], ([[cX, cY], dragState]) => {
    if (!dragState) return;
    const [mode] = dragState;
    if (mode !== 'view') return;

    const [, matrix, [ix, iy]] = dragState;
    const dx = ix - cX;
    const dy = iy - cY;
    viewStore.viewMatrix = compose(translate(-dx, -dy), matrix);
  });

  // Apply point drag state
  watch([canvasPositionRef, dragStateRef], ([currentPosition, dragState]) => {
    if (!dragState) return;
    const [mode] = dragState;
    if (mode !== 'point') return;

    const [, initialPosition, ...pairs] = dragState;
    const delta = sub(currentPosition, initialPosition);

    const layers = unref(picStore.layers);
    pairs.forEach(([lIdx, cIdx, vIdx, iVec]) => {
      const nextVec = round(add(iVec, delta));

      const layer = layers[lIdx];
      if (!layer) return;

      switch (layer.type) {
        case 'PLINE': {
          const cmd = layer.commands[cIdx];
          const next: BasicEditorCommand<PolylineCommand> = {
            ...layer,
            commands: [moveLineVertex(cmd, vIdx, nextVec)],
          };
          layersRef.value = insert(picStore.layers, lIdx, next, true);
          break;
        }
        case 'FILL': {
          const cmd = layer.commands[cIdx];
          const next: BasicEditorCommand<FillCommand> = {
            ...layer,
            commands: [moveFillVertex(cmd, nextVec)],
          };
          layersRef.value = insert(picStore.layers, lIdx, next, true);
          break;
        }
      }
    });
  });

  // Update Selection UI
  watch(
    [selCanvasRef, stageResRef, dragStateRef, lastCursorPositionRef],
    ([el, [sWidth, sHeight], dragState, p1]) => {
      if (!el) return;
      setCanvasDimensions(el, sWidth, sHeight);
      if (!dragState) return;

      const ctx = get2dContext(el);
      ctx.clearRect(0, 0, sWidth, sHeight);

      const [dragMode] = dragState;
      if (dragMode === 'sel-rect') {
        const [, p0] = dragState;
        ctx.save();
        const selRect = rect(p0, p1);
        pathPoly(ctx, selRect);
        ctx.fillStyle = 'rgba(42 82 190 / 25%)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(42 82 190 / 100%)';
        ctx.stroke();
        ctx.restore();
      }
    },
  );

  watch([selCanvasRef, dragStateRef], ([el, dragState]) => {
    if (!el || dragState) return;
    setCanvasDimensions(el, 1, 1);
    const ctx = get2dContext(el);
    ctx.clearRect(0, 0, 1, 1);
  });

  // Update the cursor layer
  watch(
    [
      cursorCanvasRef,
      stageResRef,
      matrixRef,
      lastCursorPositionRef,
      canvasPositionRef,
      activeLayerRef,
    ],
    ([el, [sWidth, sHeight], matrix, screenPoint, canvasPoint]) => {
      if (!el) return;
      setCanvasDimensions(el, sWidth, sHeight);
      const ctx = get2dContext(el);
      ctx.clearRect(0, 0, sWidth, sHeight);

      const simpleCusor = !(
        toolbarStore.selectedTool === 'line' ||
        toolbarStore.selectedTool === 'fill'
      );

      if (simpleCusor) return;

      // Draw precision cursor
      const [cWidth, cHeight] = unref(canvasResRef);
      const overCanvas = isInsideBounds([cWidth, cHeight], canvasPoint);
      if (overCanvas) {
        ctx.save();
        pixelBorder(ctx, applyToPoints(matrix, pixel(canvasPoint, -0.0125)));
        cursorDot(ctx, screenPoint);
        ctx.restore();
      }
    },
  );

  // Update the UI canvas
  watch(
    [canvasRef, stageResRef, matrixRef, activeLayerRef, selectionStateRef],
    ([el, [sWidth, sHeight], matrix, layer, selection]) => {
      if (!el) return;
      setCanvasDimensions(el, sWidth, sHeight);
      const ctx = get2dContext(el);
      ctx.clearRect(0, 0, sWidth, sHeight);

      if (layer) {
        ctx.save();
        layer.commands.forEach((cmd) => {
          const [type] = cmd;
          ctx.strokeStyle = 'white';
          ctx.fillStyle = '#ddd';
          if (type === 'PLINE') plineSkeleton(ctx, matrix, cmd);
          if (type === 'FILL') fillSkeleton(ctx, matrix, cmd);
        });
        ctx.restore();
      }

      ctx.save();
      ctx.fillStyle = 'white';
      selection.forEach(([lIdx, cIdx, vIdx]) => {
        const layers = unref(picStore.layers);
        const cmd = layers[lIdx]?.commands?.[cIdx];
        if (!cmd) return;
        const [type] = cmd;
        if (type === 'PLINE' || type === 'FILL') {
          const vertex = extractVertices(cmd)[vIdx];
          if (!vertex) return;
          pointSkeleton(ctx, matrix, vertex);
        }
      });
      ctx.restore();
    },
  );

  watch([canvasPixelRef], ([pos]) => {
    const current = cmdStore.current;
    if (current === null) return;
    if (current.type === 'PLINE') {
      const [type, options, ...coords] = current.commands[0];
      cmdStore.begin({
        ...current,
        commands: [[type, options, ...coords.slice(0, -1), pos]],
      });
    }
  });

  const mouseHandlers = {
    contextMenu: (e: MouseEvent) => {
      const { selectedTool } = toolbarStore;
      if (selectedTool === 'line') {
        e.preventDefault();
        const current = cmdStore.current;
        if (current === null || current.type !== 'PLINE') return;

        const [type, options, ...coords] = current.commands[0];
        if (coords.length < 3) {
          cmdStore.abort();
        } else {
          picStore.selection = cmdStore.commit({
            ...current,
            commands: [[type, options, ...coords.slice(0, -1)]],
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
    downPan(e: PointerEvent) {
      const { selectedTool } = toolbarStore;
      const isPanning =
        (selectedTool === 'pan' && e.button === 0) || e.button === 1;

      if (!isPanning) return;
      if (dragStateRef.value !== null) return; // already panning

      dragStateRef.value = [
        'view',
        viewStore.viewMatrix,
        [e.offsetX, e.offsetY],
      ];

      e.stopImmediatePropagation();
      e.preventDefault();
    },

    downPointSelect(e: PointerEvent) {
      const { selectedTool } = toolbarStore;
      if (!(selectedTool === 'select' && e.button === 0)) return;

      const lIdx = unref(picStore.selection);
      if (lIdx === null) return;
      const layer = unref(picStore.layers)[lIdx];
      if (!layer) return;

      const cPos = unref(canvasPositionRef);
      const found = nearestPointWithRange(
        layer.commands,
        cPos,
        Math.max(0.5, 7 / viewStore.zoom),
      );

      if (found) {
        const [cIdx, pIdx] = found;
        const p = mustGetVertexFrom(layer.commands, cIdx, pIdx);
        dragStateRef.value = ['point', cPos, [lIdx, cIdx, pIdx, p]];

        e.stopImmediatePropagation();
        e.preventDefault();
        return;
      }
    },

    downPointStartRect(e: PointerEvent) {
      const { selectedTool } = toolbarStore;
      if (!(selectedTool === 'select' && e.button === 0)) return;
      selectionStateRef.value = [];
      dragStateRef.value = ['sel-rect', vec2(e.offsetX, e.offsetY)];
    },

    downFill(e: MouseEvent) {
      const { selectedTool } = toolbarStore;
      if (!(selectedTool === 'fill' && e.button === 0)) {
        return;
      }

      const pos = round(
        applyToPoint(unref(iMatrixRef), [e.offsetX, e.offsetY]),
        vec2(),
        Math.floor,
      );

      const [drawMode, ...drawCodes] = unref(drawState);
      picStore.selection = cmdStore.commit({
        id: Math.random().toString(36).substring(2),
        type: 'FILL',
        commands: [['FILL', [drawMode, drawCodes], pos]],
      });

      e.preventDefault();
    },

    downLine(e: MouseEvent) {
      const { selectedTool } = toolbarStore;
      if (!(selectedTool === 'line' && e.button === 0)) {
        return;
      }

      const pos = round(
        applyToPoint(unref(iMatrixRef), [e.offsetX, e.offsetY]),
        vec2(),
        Math.floor,
      );

      const current = cmdStore.current;

      // Append to current line
      if (current?.type === 'PLINE') {
        const [type, options, ...coords] = current.commands[0];
        cmdStore.begin({
          ...current,
          commands: [
            [type, options, ...coords.slice(0, -1), [...pos], [...pos]],
          ],
        });
        e.preventDefault();
        return;
      }

      // Remove an existing point on the selected line
      const nearestExistingPoint = unref(nearestExistingPointRef);
      if (nearestExistingPoint) {
        const [cmdIdx, pointIdx] = nearestExistingPoint;
        picStore.updateSelection((prev) => {
          if (prev.type !== 'PLINE') return prev;

          const [type, options, ...prevVerts] = prev.commands[cmdIdx];
          const nextVerts = remove(prevVerts, pointIdx);

          if (nextVerts.length <= 1) return null;
          return {
            ...prev,
            commands: [[type, options, ...nextVerts]],
          };
        });
        e.preventDefault();
        return;
      }

      // Insert a new point on an existing line
      const nearestAddPoint = unref(nearestAddPointRef);
      if (nearestAddPoint) {
        const [cmdIdx, , idx, vert] = nearestAddPoint;
        picStore.updateSelection((prev) => {
          if (prev.type !== 'PLINE') return prev;
          const [type, options, ...prevVerts] = prev.commands[cmdIdx];
          const nextVerts = insert(
            prevVerts,
            idx,
            round(vert, vert, Math.floor),
          );
          return {
            ...prev,
            commands: [[type, options, ...nextVerts]],
          };
        });
        e.preventDefault();
        return;
      }

      // Start a new line
      if (current === null) {
        const [drawMode, ...drawCodes] = unref(drawState);
        cmdStore.begin({
          id: Math.random().toString(36).substring(2),
          type: 'PLINE',
          commands: [['PLINE', [drawMode, drawCodes], pos, pos]],
        });
        e.preventDefault();
        return;
      }
    },

    move(e: PointerEvent) {
      lastCursorPositionRef.value = [e.offsetX, e.offsetY];

      const dragState = unref(dragStateRef);
      if (dragState === null) return;

      const [mode] = dragState;

      // TODO rethink this
      const layerIdx = unref(picStore.selection);
      if (layerIdx === null) return;
      const selectedLayer = unref(picStore.layers)[layerIdx];
      if (!selectedLayer) return;
      if (selectedLayer.type !== 'PLINE' && selectedLayer.type !== 'FILL')
        return;

      if (mode === 'sel-rect') {
        const [, p0] = dragState;
        const p1 = vec2(e.offsetX, e.offsetY);

        const iMatrix = unref(iMatrixRef);
        const bounds = applyToPoints(iMatrix, rect(p0, p1));

        const selPoints: SelectionEntry[] = [];
        selectedLayer.commands.forEach((cmd, cmdIdx) => {
          const verts = extractVertices(cmd);
          verts.forEach((v, vIdx) => {
            if (!isInsidePolygon(bounds, v)) return;
            selPoints.push([layerIdx, cmdIdx, vIdx]);
          });
        });

        selectionStateRef.value = selPoints;
      }
    },
    up() {
      dragStateRef.value = null;
    },
  };

  onMounted(() => {
    const el = unref(canvasRef);
    if (!el) return;
    el.addEventListener('contextmenu', mouseHandlers.contextMenu);
    el.addEventListener('wheel', mouseHandlers.wheel);
    el.addEventListener('pointerdown', pointerHandlers.downPan);
    el.addEventListener('pointerdown', pointerHandlers.downPointSelect);
    el.addEventListener('pointerdown', pointerHandlers.downPointStartRect);
    el.addEventListener('pointerdown', pointerHandlers.downFill);
    el.addEventListener('pointerdown', pointerHandlers.downLine);
    el.addEventListener('pointermove', pointerHandlers.move);
    el.addEventListener('pointerup', pointerHandlers.up);
  });

  onUnmounted(() => {
    const el = unref(canvasRef);
    if (!el) return;
    el.removeEventListener('pointerup', pointerHandlers.up);
    el.removeEventListener('pointermove', pointerHandlers.move);
    el.removeEventListener('pointerdown', pointerHandlers.downLine);
    el.removeEventListener('pointerdown', pointerHandlers.downFill);
    el.removeEventListener('pointerdown', pointerHandlers.downPointStartRect);
    el.removeEventListener('pointerdown', pointerHandlers.downPointSelect);
    el.removeEventListener('pointerdown', pointerHandlers.downPan);
    el.removeEventListener('wheel', mouseHandlers.wheel);
    el.removeEventListener('contextmenu', mouseHandlers.contextMenu);
  });
}
