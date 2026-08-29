import {
  type Ref,
  type ShallowRef,
  type DeepReadonly,
  unref,
  computed,
} from 'vue';
import { watch } from 'vue';
import { applyToPoints, type Matrix } from 'transformation-matrix';

import { setCanvasDimensions } from '../helpers/setCanvasDimensions.js';
import { get2dContext } from '../helpers/getContext.js';
import { isInsideBounds, pixel } from '../helpers/polygons.js';
import { pixelBorder } from '../render/pixel-border.js';
import { cursorDot } from '../render/cursor-dot.js';
import { mustInject } from '../data/mustInject.js';
import { stageOptionsKey, toolKey } from '../data/keys.js';
import type { CursorPosition } from './useCursorWatcher.js';

export function usePrecisionCursorEffect(
  matrixRef: DeepReadonly<Ref<Matrix>>,
  elRef: ShallowRef<HTMLCanvasElement | null>,
  stageResRef: DeepReadonly<Ref<[number, number]>>,
  cursorPos: CursorPosition,
) {
  const toolRef = mustInject(toolKey);
  const { canvasSize } = mustInject(stageOptionsKey);

  const isOverCanvas = computed(() => {
    const [cWidth, cHeight] = unref(canvasSize);
    return isInsideBounds([cWidth, cHeight], unref(cursorPos.pixel));
  });

  watch(
    [elRef, stageResRef, matrixRef, cursorPos.screen, cursorPos.pixel],
    ([el, [sWidth, sHeight], matrix, screenPosition, canvasPixel]) => {
      if (!el) return;

      setCanvasDimensions(el, sWidth, sHeight);
      const ctx = get2dContext(el);
      ctx.clearRect(0, 0, sWidth, sHeight);

      const tool = unref(toolRef);
      const simpleCursor = !(tool === 'line' || tool === 'fill');

      if (simpleCursor) return;

      // Draw precision cursor
      if (isOverCanvas) {
        ctx.save();
        pixelBorder(ctx, applyToPoints(matrix, pixel(canvasPixel, -0.0125)));
        cursorDot(ctx, screenPosition);
        ctx.restore();
      }
    },
  );
}
