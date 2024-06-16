import { computed, Ref, shallowRef, triggerRef, unref, watch } from 'vue';
import { RenderResult } from '@4bitlabs/sci0/dist/screen/render-result.ts';

import { DrawCommand, renderPic } from '@4bitlabs/sci0';
import { createDitherFilter, renderPixelData } from '@4bitlabs/image';
import { generateSciDitherPairs, Mixers } from '@4bitlabs/color';
import { nearestNeighbor } from '@4bitlabs/resize-filters';
import { isEqual, vec2, Vec2 } from '@4bitlabs/vec2';
import { get2dContext } from '../helpers/getContext';
import { setCanvasDimensions } from '../helpers/setCanvasDimensions.ts';
import { clamp } from '../helpers/clamp.ts';
import { mustInject } from '../data/mustInject.ts';
import { paletteKey, stageOptionsKey, viewKey } from '../data/keys.ts';

export function useRenderedPixels(picDataRef: Ref<DrawCommand[]>) {
  const { canvasSize } = mustInject(stageOptionsKey);
  return computed(() => {
    const picData = unref(picDataRef);
    const [width, height] = unref(canvasSize);
    return renderPic(picData, { width, height });
  });
}

export function useCanvasRenderer(
  renderedRef: Ref<RenderResult>,
): Ref<OffscreenCanvas> {
  const { canvasSize } = mustInject(stageOptionsKey);
  const { finalColors } = mustInject(paletteKey);
  const { viewZoom: zoomRef } = mustInject(viewKey);

  const canvasRef = shallowRef(new OffscreenCanvas(1, 1));

  const oversampleRef = computed<Vec2>((prev = [1, 1]) => {
    const zoom = unref(zoomRef);
    if (zoom > 12) return [1, 1];
    const samples = Math.round(clamp(zoom, 1, 5));
    const next = vec2(samples, samples);
    return isEqual(prev, next) ? prev : next;
  });

  const isSoftRef = computed<boolean>(() => false);
  const ditherRef = computed(() =>
    createDitherFilter(
      generateSciDitherPairs(
        unref(finalColors),
        unref(isSoftRef) ? Mixers.softMixer() : ([a, b]) => [a, b],
      ),
    ),
  );

  watch(
    [renderedRef, canvasSize, oversampleRef, ditherRef],
    ([pic, [width, height], oversample, dither]) => {
      const canvas = unref(canvasRef);
      setCanvasDimensions(
        canvas,
        width * oversample[0],
        height * oversample[1],
      );

      const imgData = renderPixelData(pic.visible, {
        dither,
        post: [nearestNeighbor(oversample)],
      }) as ImageData;

      const ctx = get2dContext(canvas);
      ctx.putImageData(imgData, 0, 0);
      triggerRef(canvasRef);
    },
    { immediate: true },
  );

  return canvasRef;
}
