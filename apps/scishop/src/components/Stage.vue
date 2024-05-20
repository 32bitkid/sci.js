<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { translate, compose } from 'transformation-matrix';
import { useResizeWatcher } from '../composables/useResizeWatcher';
import { useCanvasRenderer } from '../composables/useCanvasRenderer';
import store from '../data/store';

const stageRef = ref<HTMLCanvasElement | null>(null);
const stageRes = useResizeWatcher(stageRef, 33);
const ctxRef = computed<CanvasRenderingContext2D | null>(
  () => stageRef.value?.getContext('2d', { alpha: true }) ?? null,
);

const viewStack = computed(() =>
  store.cmds.value.slice(0, store.cmds.value.length - store.cmdIdx),
);
const pixels = useCanvasRenderer(viewStack, store.canvasRes);

watch(
  [
    ctxRef,
    stageRes,
    pixels,
    store.canvasRes,
    store.viewMatrix,
    store.selectedCmd,
  ],
  ([ctx, [sWidth, sHeight], pixels, [cWidth, cHeight], matrix, topCmd]) => {
    console.log(topCmd);
    if (!ctx || sWidth === 0 || sHeight === 0) return;
    if (ctx.canvas.width !== sWidth || ctx.canvas.height !== sHeight) {
      ctx.canvas.width = sWidth;
      ctx.canvas.height = sHeight;
    }
    ctx.reset();
    ctx.imageSmoothingEnabled = false;

    ctx.setTransform(
      compose(
        translate(Math.round(sWidth / 2), Math.round(sHeight / 2)),
        matrix,
      ),
    );

    ctx.beginPath();
    ctx.fillStyle = `rgba(0 0 0 / 30%)`;
    ctx.roundRect(
      cWidth * -0.5 - 2,
      cHeight * -0.5 - 2,
      cWidth + 4,
      cHeight + 4,
      0,
    );
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = `rgba(255 255 255 / 1.0)`;
    ctx.roundRect(
      cWidth * -0.5 - 0.5,
      cHeight * -0.5 - 0.5,
      cWidth + 1,
      cHeight + 1,
      0,
    );
    ctx.fill();

    ctx.drawImage(pixels, cWidth * -0.5, cHeight * -0.5);
  },
);
</script>

<template>
  <canvas :class="$style.stage" ref="stageRef"></canvas>
</template>

<style module>
.stage {
  background-color: #666;
  grid-column: 1 / -1;
  grid-row: 2 / -1;
  width: 100%;
  height: 100%;
}
</style>
