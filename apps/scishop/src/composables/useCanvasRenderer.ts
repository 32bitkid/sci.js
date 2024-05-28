import { Ref, watch, unref, shallowRef, triggerRef, computed } from 'vue';
import { RenderResult } from '@4bitlabs/sci0/dist/screen/render-result.ts';

import { DrawCommand, renderPic } from '@4bitlabs/sci0';
import { createDitherFilter, renderPixelData } from '@4bitlabs/image';
import { generateSciDitherPairs, Mixers } from '@4bitlabs/color';
import { nearestNeighbor } from '@4bitlabs/resize-filters';
import { get2dContext } from '../helpers/getContext';
import viewStore from '../data/viewStore.ts';
import { screenPalette as screenPaletteRef } from '../data/paletteStore.ts';

const oversampleRef = computed<[number, number]>(() => {
  if (viewStore.zoom > 12) return [1, 1];
  const samples = Math.min(Math.max(1, Math.round(viewStore.zoom)), 5);

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

const isSoftRef = computed<boolean>(() => viewStore.zoom >= 1);

export function useCanvasRenderer(
  renderedRef: Ref<RenderResult>,
  resRef: Ref<[number, number]>,
): Ref<OffscreenCanvas> {
  const canvasRef = shallowRef(new OffscreenCanvas(1, 1));
  watch(
    [renderedRef, resRef, oversampleRef, screenPaletteRef, isSoftRef],
    ([pic, [width, height], oversample, palette, isSoft]) => {
      const canvas = unref(canvasRef);
      canvas.width = width * oversample[0];
      canvas.height = height * oversample[1];

      const imgData = renderPixelData(pic.visible, {
        dither: createDitherFilter(
          generateSciDitherPairs(
            palette,
            isSoft ? Mixers.softMixer() : ([a, b]) => [a, b],
          ),
          [1, 1],
        ),
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
