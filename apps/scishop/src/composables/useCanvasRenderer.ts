import { computed, Ref, shallowRef, triggerRef, unref, watch } from 'vue';
import { RenderResult } from '@4bitlabs/sci0/dist/screen/render-result.ts';

import { DrawCommand, renderPic } from '@4bitlabs/sci0';
import { createDitherFilter, renderPixelData } from '@4bitlabs/image';
import { generateSciDitherPairs, Mixers } from '@4bitlabs/color';
import { nearestNeighbor } from '@4bitlabs/resize-filters';
import { get2dContext } from '../helpers/getContext';
import { zoomRef } from '../data/viewStore.ts';
import { screenPalette as screenPaletteRef } from '../data/paletteStore.ts';
import { setCanvasDimensions } from '../helpers/setCanvasDimensions.ts';
import { clamp } from '../helpers/clamp.ts';

const oversampleRef = computed<[number, number]>(() => {
  const zoom = unref(zoomRef);
  if (zoom > 12) return [1, 1];
  const samples = Math.round(clamp(zoom, 1, 5));
  return [samples, samples];
});

export function useRenderedPixels(
  picDataRef: Ref<DrawCommand[]>,
  resRef: Ref<[number, number]>,
) {
  return computed(() => {
    const picData = unref(picDataRef);
    const [width, height] = unref(resRef);
    return renderPic(picData, { width, height });
  });
}

const isSoftRef = computed<boolean>(() => unref(zoomRef) >= 1);
const ditherRef = computed(() =>
  createDitherFilter(
    generateSciDitherPairs(
      unref(screenPaletteRef),
      unref(isSoftRef) ? Mixers.softMixer() : ([a, b]) => [a, b],
    ),
  ),
);

export function useCanvasRenderer(
  renderedRef: Ref<RenderResult>,
  resRef: Ref<[number, number]>,
): Ref<OffscreenCanvas> {
  const canvasRef = shallowRef(new OffscreenCanvas(1, 1));

  watch(
    [renderedRef, resRef, oversampleRef, ditherRef],
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
