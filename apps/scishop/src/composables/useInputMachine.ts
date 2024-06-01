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

import { round, vec2, Vec2, sub, add } from '@4bitlabs/vec2';
import { FillCommand, PolylineCommand } from '@4bitlabs/sci0';
import { get2dContext } from '../helpers/getContext.ts';
import {
  isInsideBounds,
  isInsidePolygon,
  pathPoly,
  rect,
} from '../helpers/polygons.ts';
import { fillSkeleton } from '../render/fill-skeleton.ts';
import { plineSkeleton } from '../render/pline-skeleton.ts';
import {
  anyPointCloseTo,
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
import { pointSkeleton } from '../render/point-skeleton.ts';
import { useUpdateSelectionFn } from '../data/useUpdateSelectionFn.ts';
import { useCurrentCommandActions } from '../data/useCurrentCommandActions.ts';
import {
  currentKey,
  drawStateKey,
  layersKey,
  pointersKey,
  stageOptionsKey,
  toolKey,
  viewKey,
} from '../data/keys.ts';
import { mustInject } from '../data/mustInject.ts';
import { CursorPosition } from './useCursorWatcher.ts';

const clampZoom = (current: number, next: number, min: number, max: number) => {
  if (current * next < min) return min / current;
  if (current * next > max) return max / current;
  return next;
};

type SelectionEntry = [layerIdx: number, cmdIdx: number, vertexIdx: number];

type EmptyDragState = ['none'];
type ViewDragState = ['view', iMatrix: Matrix, iPosition: Vec2];
type PointDragEntry = [...SelectionEntry, initial: Vec2];
type PointDragState = ['point', iPosition: Vec2, ...PointDragEntry[]];
type SelectionDragState = ['sel-rect', start: Vec2];

type DragStates =
  | EmptyDragState
  | ViewDragState
  | PointDragState
  | SelectionDragState;

export function useInputMachine(
  matrixRef: Ref<Matrix>,
  canvasRef: Ref<HTMLCanvasElement | null>,
  selCanvasRef: Ref<HTMLCanvasElement | null>,
  stageResRef: Ref<[number, number]>,
  cursorPosition: CursorPosition,
) {
  const layersRef = mustInject(layersKey);
  const toolRef = mustInject(toolKey);
  const currentRef = mustInject(currentKey);
  const { matrix: viewMatrixRef, viewZoom: zoomRef } = mustInject(viewKey);
  const { canvasSize } = mustInject(stageOptionsKey);
  const { raw: rawDrawState } = mustInject(drawStateKey);
  const { topIdx: topIdxRef, selectedIdx: selectedIdxRef } =
    mustInject(pointersKey);

  const updateSelection = useUpdateSelectionFn({
    layers: layersRef,
    topIdx: topIdxRef,
    selectedIdx: selectedIdxRef,
  });

  const cmdStore = useCurrentCommandActions({
    layers: layersRef,
    current: currentRef,
    topIdx: topIdxRef,
    selectedIdx: selectedIdxRef,
  });

  const selectedLayerRef = computed(() => {
    const selIdx = unref(selectedIdxRef);
    return selIdx !== null ? unref(layersRef)[selIdx] : null;
  });

  const activeLayerRef = computed(() => {
    const current = unref(currentRef);
    if (current) return current;
    return unref(selectedLayerRef);
  });

  const pointerRadiusRef = computed(() =>
    Math.max(0.404, 7.5 / unref(zoomRef)),
  );

  const iMatrixRef = computed(() => inverse(unref(matrixRef)));
  const dragStateRef = shallowRef<DragStates>(['none']);
  const selectionStateRef = shallowRef<SelectionEntry[]>([]);

  const {
    screen: lastCursorPositionRef,
    canvas: canvasPositionRef,
    pixel: canvasPixelRef,
  } = cursorPosition;

  const isOverCanvasRef = computed<boolean>(() => {
    const canvasPoint = unref(canvasPixelRef);
    const [cWidth, cHeight] = unref(canvasSize);
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

    const [dragMode] = unref(dragStateRef);
    const selectedTool = unref(toolRef);

    let currentCursor = 'auto';
    if (dragMode === 'view') {
      currentCursor = 'grabbing';
    } else if (selectedTool === 'pan') {
      currentCursor = 'grab';
    } else if (selectedTool === 'select') {
      currentCursor = 'crosshair';
    } else if (selectedTool == 'line') {
      const isOverCanvas = unref(isOverCanvasRef);
      if (isOverCanvas) {
        if (unref(currentRef)) {
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
  watch([dragStateRef, lastCursorPositionRef], ([dragState, [cX, cY]]) => {
    const [mode] = dragState;
    if (mode !== 'view') return;

    const [, matrix, [ix, iy]] = dragState;
    const dx = ix - cX;
    const dy = iy - cY;
    viewMatrixRef.value = compose(translate(-dx, -dy), matrix);
  });

  // Apply point drag state
  watch([canvasPositionRef, dragStateRef], ([currentPosition, dragState]) => {
    if (!dragState) return;
    const [mode] = dragState;
    if (mode !== 'point') return;

    const [, initialPosition, ...pairs] = dragState;
    const delta = sub(currentPosition, initialPosition);

    layersRef.value = pairs.reduce((prevLayers, [lIdx, cIdx, vIdx, iVec]) => {
      const nextVec = round(add(iVec, delta));
      const layer = prevLayers[lIdx];

      switch (layer?.type) {
        case 'PLINE': {
          const cmd = layer.commands[cIdx];
          const next: BasicEditorCommand<PolylineCommand> = {
            ...layer,
            commands: [moveLineVertex(cmd, vIdx, nextVec)],
          };
          return insert(prevLayers, lIdx, next, true);
        }
        case 'FILL': {
          const cmd = layer.commands[cIdx];
          const next: BasicEditorCommand<FillCommand> = {
            ...layer,
            commands: [moveFillVertex(cmd, nextVec)],
          };
          return insert(prevLayers, lIdx, next, true);
        }
      }
      return prevLayers;
    }, unref(layersRef));
  });

  // Update Selection UI
  watch(
    [selCanvasRef, stageResRef, dragStateRef, lastCursorPositionRef],
    ([el, [sWidth, sHeight], dragState, p1]) => {
      if (!el) return;
      setCanvasDimensions(el, sWidth, sHeight);

      const [dragMode] = dragState;
      if (dragMode !== 'sel-rect') return;

      const ctx = get2dContext(el);
      ctx.clearRect(0, 0, sWidth, sHeight);

      const [, p0] = dragState;
      ctx.save();
      const selRect = rect(p0, p1);
      pathPoly(ctx, selRect);
      ctx.fillStyle = 'rgba(42 82 190 / 25%)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(42 82 190 / 100%)';
      ctx.stroke();
      ctx.restore();
    },
  );

  watch([selCanvasRef, dragStateRef], ([el, [dragMode]]) => {
    if (!el) return;
    if (dragMode !== 'none') return;
    setCanvasDimensions(el, 1, 1);
    const ctx = get2dContext(el);
    ctx.clearRect(0, 0, 1, 1);
  });

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
        const layers = unref(layersRef);
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

  // update current
  watch([canvasPixelRef], ([pos]) => {
    const current = unref(currentRef);
    if (current === null) return;
    if (current.type === 'PLINE') {
      const [type, options, ...coords] = current.commands[0];
      cmdStore.begin({
        ...current,
        commands: [[type, options, ...coords.slice(0, -1), pos]],
      });
    }
  });

  watch([dragStateRef, lastCursorPositionRef], ([dragState, p1]) => {
    const [mode] = dragState;

    if (mode !== 'sel-rect') return;

    // TODO rethink this
    const layerIdx = unref(selectedIdxRef);
    if (layerIdx === null) return;
    const selectedLayer = unref(layersRef)[layerIdx];
    if (!selectedLayer) return;
    if (selectedLayer.type !== 'PLINE' && selectedLayer.type !== 'FILL') return;

    const [, p0] = dragState;
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
  });

  const mouseHandlers = {
    contextMenu: (e: MouseEvent) => {
      const selectedTool = unref(toolRef);
      if (selectedTool === 'line') {
        e.preventDefault();
        const current = unref(currentRef);
        if (current === null || current.type !== 'PLINE') return;

        const [type, options, ...coords] = current.commands[0];
        if (coords.length < 3) {
          cmdStore.abort();
        } else {
          cmdStore.commit({
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
        unref(zoomRef),
        e.deltaY / 1000 + 1,
        0.5,
        100,
      );
      viewMatrixRef.value = compose(
        translate(dx, dy),
        scale(scaleFactor),
        rotateDEG(-e.deltaX / 40),
        translate(-dx, -dy),
        unref(viewMatrixRef),
      );
    },
  };

  const pointerHandlers = {
    downPan(e: PointerEvent) {
      const selectedTool = unref(toolRef);
      const startPan =
        (selectedTool === 'pan' && e.button === 0) || e.button === 1;

      if (!startPan) return;

      dragStateRef.value = [
        'view',
        unref(viewMatrixRef),
        [e.offsetX, e.offsetY],
      ];

      e.stopImmediatePropagation();
      e.preventDefault();
    },

    downSelectionMoveStart(e: PointerEvent) {
      const selectedTool = unref(toolRef);
      if (!(selectedTool === 'select' && e.button === 0)) return;

      const layers = unref(layersRef);
      const cPos = unref(canvasPositionRef);

      const selState = unref(selectionStateRef);
      const selectedVertices = selState.flatMap(([lIdx, cIdx, vIdx]) => {
        const cmd = layers[lIdx]?.commands[cIdx];
        if (!cmd) return [];
        if (cmd[0] !== 'PLINE' && cmd[0] !== 'FILL') return [];
        const vertex = extractVertices(cmd)[vIdx];
        if (!vertex) return [];
        const [x, y] = vertex;
        return [vec2(x + 0.5, y + 0.5)];
      });

      const found = anyPointCloseTo(
        selectedVertices,
        cPos,
        unref(pointerRadiusRef),
      );

      if (!found) return;

      const dragEntries = selState.map<PointDragEntry>(([lIdx, cIdx, pIdx]) => [
        lIdx,
        cIdx,
        pIdx,
        mustGetVertexFrom(layers[lIdx].commands, cIdx, pIdx),
      ]);

      dragStateRef.value = ['point', cPos, ...dragEntries];

      e.stopImmediatePropagation();
      e.preventDefault();
    },

    downPointSelect(e: PointerEvent) {
      const selectedTool = unref(toolRef);
      if (!(selectedTool === 'select' && e.button === 0)) return;

      const layers = unref(layersRef);
      const cPos = unref(canvasPositionRef);

      const iIdx = unref(selectedIdxRef);
      if (iIdx === null) return;

      const layer = layers[iIdx];
      if (!layer) return;

      const found = nearestPointWithRange(
        layer.commands,
        cPos,
        unref(pointerRadiusRef),
      );

      if (found) {
        const [cIdx, pIdx] = found;
        const p = mustGetVertexFrom(layer.commands, cIdx, pIdx);
        dragStateRef.value = ['point', cPos, [iIdx, cIdx, pIdx, p]];

        e.stopImmediatePropagation();
        e.preventDefault();
        return;
      }
    },

    downPointStartRect(e: PointerEvent) {
      const selectedTool = unref(toolRef);
      if (!(selectedTool === 'select' && e.button === 0)) return;
      selectionStateRef.value = [];
      dragStateRef.value = ['sel-rect', vec2(e.offsetX, e.offsetY)];
    },

    downFill(e: MouseEvent) {
      const selectedTool = unref(toolRef);
      if (!(selectedTool === 'fill' && e.button === 0)) {
        return;
      }

      const pos = round(
        applyToPoint(unref(iMatrixRef), [e.offsetX, e.offsetY]),
        vec2(),
        Math.floor,
      );

      const [drawMode, ...drawCodes] = unref(rawDrawState);
      cmdStore.commit({
        id: Math.random().toString(36).substring(2),
        type: 'FILL',
        commands: [['FILL', [drawMode, drawCodes], pos]],
      });

      e.preventDefault();
    },

    downLine(e: MouseEvent) {
      const selectedTool = unref(toolRef);
      if (!(selectedTool === 'line' && e.button === 0)) {
        return;
      }

      const pos = round(
        applyToPoint(unref(iMatrixRef), [e.offsetX, e.offsetY]),
        vec2(),
        Math.floor,
      );

      const current = unref(currentRef);

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
        updateSelection((prev) => {
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
        updateSelection((prev) => {
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
        const [drawMode, ...drawCodes] = unref(rawDrawState);
        cmdStore.begin({
          id: Math.random().toString(36).substring(2),
          type: 'PLINE',
          commands: [['PLINE', [drawMode, drawCodes], pos, pos]],
        });
        e.preventDefault();
        return;
      }
    },

    up() {
      dragStateRef.value = ['none'];
    },
  };

  onMounted(() => {
    const el = unref(canvasRef);
    if (!el) return;
    el.addEventListener('contextmenu', mouseHandlers.contextMenu);
    el.addEventListener('wheel', mouseHandlers.wheel);
    el.addEventListener('pointerdown', pointerHandlers.downPan);
    el.addEventListener('pointerdown', pointerHandlers.downSelectionMoveStart);
    el.addEventListener('pointerdown', pointerHandlers.downPointSelect);
    el.addEventListener('pointerdown', pointerHandlers.downPointStartRect);
    el.addEventListener('pointerdown', pointerHandlers.downFill);
    el.addEventListener('pointerdown', pointerHandlers.downLine);
    el.addEventListener('pointerup', pointerHandlers.up);
  });

  onUnmounted(() => {
    const el = unref(canvasRef);
    if (!el) return;
    el.removeEventListener('pointerup', pointerHandlers.up);
    el.removeEventListener('pointerdown', pointerHandlers.downLine);
    el.removeEventListener('pointerdown', pointerHandlers.downFill);
    el.removeEventListener('pointerdown', pointerHandlers.downPointStartRect);
    el.removeEventListener('pointerdown', pointerHandlers.downPointSelect);
    el.removeEventListener(
      'pointerdown',
      pointerHandlers.downSelectionMoveStart,
    );
    el.removeEventListener('pointerdown', pointerHandlers.downPan);
    el.removeEventListener('wheel', mouseHandlers.wheel);
    el.removeEventListener('contextmenu', mouseHandlers.contextMenu);
  });
}
