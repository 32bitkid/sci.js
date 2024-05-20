import { Ref, shallowRef, triggerRef, watchEffect, unref } from 'vue';

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
  const [width, height] = unref(resolution);
  const pixels = new OffscreenCanvas(width, height);
  const pixelsRef = shallowRef(pixels);

  const pCtx = pixels.getContext('2d');
  if (pCtx === null) throw new Error('unable to allocate canvas context');

  const img = new ImageData(width, height);
  watchEffect(() => {
    const { visible } = renderPic(unref(picData), { width, height });
    const imgData = renderPixelData(visible, {
      dither: createDitherFilter(
        generateSciDitherPairs(
          IBM5153Contrast(Palettes.TRUE_CGA_PALETTE, 0.4),
          Mixers.softMixer(),
        ),
      ),
    });
    img.data.set(imgData.data);
    pCtx.putImageData(img, 0, 0);
    triggerRef(pixelsRef);
  });

  return pixelsRef;
}
