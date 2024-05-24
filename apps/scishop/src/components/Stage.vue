<script setup lang="ts">
import { watch, computed, unref, shallowRef } from 'vue';
import {
  translate,
  compose,
  applyToPoints,
  scale,
  Matrix,
} from 'transformation-matrix';
import { useResizeWatcher } from '../composables/useResizeWatcher';
import { useCanvasRenderer } from '../composables/useCanvasRenderer';
import store from '../data/store';
import { get2dContext } from '../helpers/getContext.ts';
import { useInputMachine } from '../composables/useInputMachine.ts';
import { FillCommand, PolylineCommand } from '@4bitlabs/sci0';

const stageRef = shallowRef<HTMLCanvasElement | null>(null);
const stageRes = useResizeWatcher(stageRef, 100);

const viewStack = computed(() => store.cmds.value.slice(0, store.topIdx + 1));
const pixels = useCanvasRenderer(viewStack, store.canvasRes);

watch([pixels], () => {
  console.log('pixels changed');
});

const matrixRef = computed(() => {
  const [sWidth, sHeight] = unref(stageRes);
  const [cWidth, cHeight] = unref(store.canvasRes);
  const viewMatrix = unref(store.viewMatrix);
  return compose(
    translate(Math.round(sWidth / 2), Math.round(sHeight / 2)),
    viewMatrix,
    scale(1, unref(store.aspectRatio)),
    translate(cWidth * -0.5, cHeight * -0.5),
  );
});

const drawFILL = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  matrix: Matrix,
  cmd: FillCommand,
) => {
  const [, , , ...points] = cmd;
  const all = applyToPoints(
    matrix,
    points.map(([x, y]) => [x + 0.5, y + 0.5]),
  );

  all.forEach(([x, y]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(3, 0);
    ctx.lineTo(0, -4);
    ctx.lineTo(-3, 0);
    ctx.lineTo(0, 4);
    ctx.lineTo(3, 0);
    ctx.stroke();
    ctx.restore();
  });
};

const drawPLINE = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  matrix: Matrix,
  cmd: PolylineCommand,
) => {
  const [, , , ...points] = cmd;
  const all = applyToPoints(
    matrix,
    points.map(([x, y]) => [x + 0.5, y + 0.5]),
  );

  {
    ctx.beginPath();
    const [first, ...rest] = all;
    ctx.moveTo(...first);
    rest.forEach(([x, y]) => ctx.lineTo(x, y));

    ctx.stroke();
  }

  all.forEach(([x, y]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.roundRect(-3, -3, 6, 6, 0.5);
    ctx.stroke();
    ctx.restore();
  });
};

watch(
  [stageRef, stageRes, pixels, store.canvasRes, matrixRef],
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
  { flush: 'post' },
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
