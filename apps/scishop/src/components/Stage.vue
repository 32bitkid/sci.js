<script setup lang="ts">
import { watch, computed, unref, shallowRef } from 'vue';
import {
  translate,
  compose,
  scale,
  applyToPoints,
} from 'transformation-matrix';
import { useResizeWatcher } from '../composables/useResizeWatcher';
import {
  useCanvasRenderer,
  useRenderedPixels,
} from '../composables/useCanvasRenderer';
import { currentCommandsRef, layersRef, topIdxRef } from '../data/picStore';
import { aspectRatioRef, canvasSizeRef } from '../data/stageStore';
import { viewMatrixRef, zoomRef } from '../data/viewStore';
import { get2dContext } from '../helpers/getContext';
import { useInputMachine } from '../composables/useInputMachine';
import { pathPoly } from '../helpers/polygons.ts';

const stageRef = shallowRef<HTMLCanvasElement | null>(null);
const uiRef = shallowRef<HTMLCanvasElement | null>(null);
const selectRef = shallowRef<HTMLCanvasElement | null>(null);
const cursorRef = shallowRef<HTMLCanvasElement | null>(null);
const stageRes = useResizeWatcher(stageRef);

const viewStack = computed(() => [
  ...unref(layersRef)
    .slice(0, unref(topIdxRef))
    .flatMap((it) => [...it.commands]),
  ...unref(currentCommandsRef),
]);

const renderResult = useRenderedPixels(viewStack, canvasSizeRef);
const pixels = useCanvasRenderer(renderResult, canvasSizeRef);

const matrixRef = computed(() => {
  const [sWidth, sHeight] = unref(stageRes);
  const [cWidth, cHeight] = unref(canvasSizeRef);
  return compose(
    translate(Math.round(sWidth / 2), Math.round(sHeight / 2)),
    unref(viewMatrixRef),
    scale(1, unref(aspectRatioRef)),
    translate(cWidth * -0.5, cHeight * -0.5),
  );
});

const smootherizeRef = computed(() => unref(zoomRef) < 8);

watch(
  [stageRef, stageRes, pixels, canvasSizeRef, matrixRef, smootherizeRef],
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

useInputMachine(
  matrixRef,
  uiRef,
  selectRef,
  cursorRef,
  stageRes,
  canvasSizeRef,
);
</script>

<template>
  <canvas :class="[$style.canvas, $style.stage]" ref="stageRef"></canvas>
  <canvas :class="[$style.canvas, $style.selLayer]" ref="selectRef"></canvas>
  <canvas :class="[$style.canvas, $style.cursorLayer]" ref="cursorRef"></canvas>
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
