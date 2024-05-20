import { Ref, shallowRef, triggerRef, watchEffect, unref, computed } from 'vue';

import { DrawCommand, renderPic } from '@4bitlabs/sci0';
import { createDitherFilter, renderPixelData } from '@4bitlabs/image';
import {
  generateSciDitherPairs,
  IBM5153Contrast,
  Mixers,
  Palettes,
} from '@4bitlabs/color';

export function useCanvasRenderer(
  picData: Ref<DrawCommand[]>,
  resolution: Ref<[number, number]>,
) {
  const pixelsRef = computed(() => {
    const [width, height] = unref(resolution);
    return new OffscreenCanvas(width, height);
  });

  const pCtx = computed(() => {
    const ctx = unref(pixelsRef).getContext('2d');
    if (ctx === null) throw new Error('unable to allocate canvas context');
    return ctx;
  });

  const imageDataRef = computed(() => {
    const [width, height] = unref(resolution);
    return new ImageData(width, height);
  });

  watchEffect(() => {
    const [width, height] = unref(resolution);
    const { visible } = renderPic(unref(picData), { width, height });
    const imgData = renderPixelData(visible, {
      dither: createDitherFilter(
        generateSciDitherPairs(
          IBM5153Contrast(Palettes.TRUE_CGA_PALETTE, 0.4),
          Mixers.softMixer(),
        ),
      ),
    });
    const img = unref(imageDataRef);
    img.data.set(imgData.data);
    unref(pCtx).putImageData(img, 0, 0);
    triggerRef(pixelsRef);
  });

  return pixelsRef;
}
