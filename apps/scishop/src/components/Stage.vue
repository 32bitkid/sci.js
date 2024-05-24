<script setup lang="ts">
import { watch, computed, unref, shallowRef } from 'vue';
import { translate, compose, scale } from 'transformation-matrix';
import { useResizeWatcher } from '../composables/useResizeWatcher';
import { useCanvasRenderer } from '../composables/useCanvasRenderer';
import store from '../data/picStore';
import stageStore from '../data/stageStore';
import viewStore from '../data/viewStore';
import { get2dContext } from '../helpers/getContext';
import { useInputMachine } from '../composables/useInputMachine';

const stageRef = shallowRef<HTMLCanvasElement | null>(null);
const stageRes = useResizeWatcher(stageRef, 100);

const viewStack = computed(() => store.layers.slice(0, store.topIdx + 1));
const pixels = useCanvasRenderer(viewStack, stageStore.canvasRes);

const matrixRef = computed(() => {
  const [sWidth, sHeight] = unref(stageRes);
  const [cWidth, cHeight] = unref(stageStore.canvasRes);
  const viewMatrix = unref(viewStore.viewMatrix);
  return compose(
    translate(Math.round(sWidth / 2), Math.round(sHeight / 2)),
    viewMatrix,
    scale(1, unref(stageStore.aspectRatio)),
    translate(cWidth * -0.5, cHeight * -0.5),
  );
});

watch(
  [stageRef, stageRes, pixels, stageStore.canvasRes, matrixRef],
  ([stage, [sWidth, sHeight], pixels, [cWidth, cHeight], matrix]) => {
    if (!stage || sWidth < 0 || sHeight < 0) return;
    if (stage.width !== sWidth || stage.height !== sHeight) {
      stage.width = sWidth;
      stage.height = sHeight;
    }

    const ctx = get2dContext(stage);

    ctx.resetTransform();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, sWidth, sHeight);

    ctx.setTransform(matrix);

    ctx.beginPath();
    ctx.fillStyle = `rgba(0 0 0 / 30%)`;
    ctx.roundRect(-2, -2, cWidth + 4, cHeight + 4, 1);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = `rgba(255 255 255 / 1.0)`;
    ctx.rect(-0.5, -0.5, cWidth + 1, cHeight + 1);
    ctx.fill();

    ctx.drawImage(pixels, 0, 0, cWidth, cHeight);
    ctx.resetTransform();
  },
);

useInputMachine(matrixRef, stageRef);
</script>

<template>
  <canvas :class="$style.stage" ref="stageRef"></canvas>
</template>

<style module>
.stage {
  background-color: #666;
  grid-column: 1 / -2;
  grid-row: 2 / -2;
  width: 100%;
  height: 100%;
}
</style>
