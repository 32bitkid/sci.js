<script setup lang="ts">
import { ref, watch, computed, unref } from 'vue';
import {
  translate,
  compose,
  inverse,
  applyToPoints,
} from 'transformation-matrix';
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

const matrixRef = computed(() => {
  const [sWidth, sHeight] = unref(stageRes);
  const [cWidth, cHeight] = unref(store.canvasRes);
  const viewMatrix = unref(store.viewMatrix);
  const matrix = compose(
    translate(Math.round(sWidth / 2), Math.round(sHeight / 2)),
    viewMatrix,
    translate(cWidth * -0.5, cHeight * -0.5),
  );

  return { matrix, inverse: inverse(matrix) };
});

watch(
  [ctxRef, stageRes, pixels, store.canvasRes, matrixRef, store.selectedCmd],
  ([ctx, [sWidth, sHeight], pixels, [cWidth, cHeight], { matrix }, topCmd]) => {
    if (!ctx || sWidth === 0 || sHeight === 0) return;
    if (ctx.canvas.width !== sWidth || ctx.canvas.height !== sHeight) {
      ctx.canvas.width = sWidth;
      ctx.canvas.height = sHeight;
    }
    ctx.reset();
    ctx.imageSmoothingEnabled = false;

    ctx.setTransform(matrix);

    ctx.beginPath();
    ctx.fillStyle = `rgba(0 0 0 / 30%)`;
    ctx.roundRect(-2, -2, cWidth + 4, cHeight + 4, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = `rgba(255 255 255 / 1.0)`;
    ctx.roundRect(-0.5, -0.5, cWidth + 1, cHeight + 1, 0);
    ctx.fill();

    ctx.drawImage(pixels, 0, 0);
    ctx.resetTransform();

    if (topCmd[0] === 'PLINE') {
      const [, , , ...points] = topCmd;
      const [...all] = applyToPoints(
        matrix,
        points.map(([x, y]) => [x + 0.5, y + 0.5]),
      );

      ctx.lineCap = 'round';

      ctx.beginPath();
      const [first, ...rest] = all;
      ctx.moveTo(...first);
      rest.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.strokeStyle = 'rgba(0 0 0)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.strokeStyle = 'orange';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      all.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'orange';
        ctx.fill();
      });
    }
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
