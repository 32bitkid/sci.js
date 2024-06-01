<script setup lang="ts">
import { watch, computed, unref, shallowRef } from 'vue';
import { translate, compose, applyToPoints } from 'transformation-matrix';
import { useResizeWatcher } from '../composables/useResizeWatcher';
import {
  useCanvasRenderer,
  useRenderedPixels,
} from '../composables/useCanvasRenderer';
import { get2dContext } from '../helpers/getContext';
import { useInputMachine } from '../composables/useInputMachine';
import { pathPoly } from '../helpers/polygons.ts';
import { mustInject } from '../data/mustInject.ts';
import {
  layersKey,
  pointersKey,
  stageOptionsKey,
  viewKey,
} from '../data/keys.ts';
import * as Keys from '../data/keys.ts';
import { useCursorWatcher } from '../composables/useCursorWatcher.ts';
import { usePrecisionCursorEffect } from '../composables/useCursorEffect.ts';
import { useFindTool } from '../composables/useFindTool.ts';

const layersRef = mustInject(layersKey);
const { matrix: viewMatrixRef, viewZoom: zoomRef } = mustInject(viewKey);
const { canvasSize, aspectRatioScaleComponent } = mustInject(stageOptionsKey);
const { topIdx: topIdxRef } = mustInject(pointersKey);
const currentRef = mustInject(Keys.currentKey);

const stageRef = shallowRef<HTMLCanvasElement | null>(null);
const uiRef = shallowRef<HTMLCanvasElement | null>(null);
const selectRef = shallowRef<HTMLCanvasElement | null>(null);
const cursorCanvasRef = shallowRef<HTMLCanvasElement | null>(null);
const stageRes = useResizeWatcher(stageRef);

const currentCommands = computed(() => {
  const current = unref(currentRef);
  return current ? [...current.commands] : [];
});

const viewStack = computed(() => [
  ...unref(layersRef)
    .slice(0, unref(topIdxRef))
    .flatMap((it) => [...it.commands]),
  ...unref(currentCommands),
]);

const renderResult = useRenderedPixels(viewStack);
const pixels = useCanvasRenderer(renderResult);

const matrixRef = computed(() => {
  const [sWidth, sHeight] = unref(stageRes);
  const [cWidth, cHeight] = unref(canvasSize);
  return compose(
    translate(Math.round(sWidth / 2), Math.round(sHeight / 2)),
    unref(viewMatrixRef),
    unref(aspectRatioScaleComponent),
    translate(cWidth * -0.5, cHeight * -0.5),
  );
});

const smootherizeRef = computed(() => unref(zoomRef) < 8);
const cursorPosition = useCursorWatcher(uiRef, matrixRef);

watch(
  [stageRef, stageRes, pixels, canvasSize, matrixRef, smootherizeRef],
  ([stage, [sWidth, sHeight], pixels, [cWidth, cHeight], matrix, smooth]) => {
    if (!stage || sWidth < 0 || sHeight < 0) return;
    if (stage.width !== sWidth || stage.height !== sHeight) {
      stage.width = sWidth;
      stage.height = sHeight;
    }

    const ctx = get2dContext(stage);

    ctx.resetTransform();
    ctx.imageSmoothingEnabled = smooth;
    ctx.imageSmoothingQuality = 'medium';
    ctx.clearRect(0, 0, sWidth, sHeight);

    ctx.save();
    pathPoly(
      ctx,
      applyToPoints(matrix, [
        [-1.5, -1.5],
        [cWidth + 1.5, -1.5],
        [cWidth + 1.5, cHeight + 1.5],
        [-1.5, cHeight + 1.5],
      ]),
    );
    ctx.shadowColor = `rgba(0 0 0 / 25%)`;
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 10;
    ctx.shadowOffsetX = 10;
    ctx.fillStyle = `black`;
    ctx.fill();
    ctx.restore();

    ctx.setTransform(matrix);

    ctx.beginPath();
    ctx.fillStyle = `rgba(255 255 255 / 1.0)`;
    ctx.rect(-0.5, -0.5, cWidth + 1, cHeight + 1);
    ctx.fill();

    ctx.drawImage(pixels, 0, 0, cWidth, cHeight);
    ctx.resetTransform();
  },
);

useInputMachine(matrixRef, uiRef, selectRef, stageRes, cursorPosition);
usePrecisionCursorEffect(matrixRef, cursorCanvasRef, stageRes, cursorPosition);
useFindTool(uiRef, renderResult, cursorPosition);
</script>

<template>
  <canvas :class="[$style.canvas, $style.stage]" ref="stageRef"></canvas>
  <canvas :class="[$style.canvas, $style.selLayer]" ref="selectRef"></canvas>
  <canvas
    :class="[$style.canvas, $style.cursorLayer]"
    ref="cursorCanvasRef"
  ></canvas>
  <canvas :class="[$style.canvas, $style.ui]" ref="uiRef"></canvas>
</template>

<style module>
.canvas {
  grid-column: 1 / -2;
  grid-row: 2 / -2;
  width: 100%;
  height: 100%;
}

.stage {
  background-color: #666;
}

.ui,
.cursorLayer {
  mix-blend-mode: exclusion;
}
</style>
