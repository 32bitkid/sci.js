import { Ref, watch, unref, shallowRef, triggerRef, computed } from 'vue';

import { DrawCommand, renderPic } from '@4bitlabs/sci0';
import { createDitherFilter, renderPixelData } from '@4bitlabs/image';
import {
  generateSciDitherPairs,
  IBM5153Contrast,
  Mixers,
  Palettes,
} from '@4bitlabs/color';
import { nearestNeighbor } from '@4bitlabs/resize-filters';
import { get2dContext } from '../helpers/getContext.ts';

export function useCanvasRenderer(
  picDataRef: Ref<DrawCommand[]>,
  resRef: Ref<[number, number]>,
): Ref<OffscreenCanvas> {
  const canvasRef = shallowRef(new OffscreenCanvas(1, 1));

  const renderedRef = computed(() => {
    const picData = unref(picDataRef);
    const [width, height] = unref(resRef);
    return renderPic(picData, { width, height });
  });

  watch(
    [renderedRef, resRef],
    ([pic, [width, height]]) => {
      const canvas = unref(canvasRef);
      canvas.width = width * 5;
      canvas.height = height * 6;

      const imgData = renderPixelData(pic.visible, {
        dither: createDitherFilter(
          generateSciDitherPairs(
            IBM5153Contrast(Palettes.TRUE_CGA_PALETTE, 0.4),
            Mixers.softMixer(),
          ),
          [1, 1],
        ),
        post: [nearestNeighbor([5, 6])],
        // post: [nearestNeighbor([5, 6])],
      }) as ImageData;

      const ctx = get2dContext(canvas);
      ctx.putImageData(imgData, 0, 0);
      triggerRef(canvasRef);
    },
    { immediate: true },
  );

  return canvasRef;
}
