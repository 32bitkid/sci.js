import { computed, ComputedRef, Ref, ShallowRef } from 'vue';
import { onMounted, onUnmounted, unref } from 'vue';
import { applyToPoint, inverse, Matrix } from 'transformation-matrix';

import { isEqual, round, vec2 } from '@4bitlabs/vec2';
import { useRafRef } from './useRafRef.ts';
import { isInsideBounds } from '../helpers/polygons.ts';
import { mustInject } from '../data/mustInject.ts';
import { stageOptionsKey } from '../data/keys.ts';

export interface CursorPosition {
  screen: Readonly<Ref<[number, number]>>;
  canvas: Readonly<ComputedRef<[number, number]>>;
  pixel: Readonly<ComputedRef<[number, number]>>;
  isOver: Readonly<Ref<boolean>>;
}

export function useCursorWatcher(
  targetRef: ShallowRef<HTMLElement | null>,
  matrixRef: Ref<Matrix>,
): CursorPosition {
  const { canvasSize } = mustInject(stageOptionsKey);

  const iMatrixRef = computed(() => inverse(unref(matrixRef)));

  const screenPositionRef = useRafRef<[number, number]>([0, 0]);
  const canvasPositionRef = computed<[number, number]>((prev = vec2()) => {
    const actual = applyToPoint(unref(iMatrixRef), unref(screenPositionRef));
    const next = round(actual, vec2(), (i) => Math.floor(i * 8) / 8);
    return isEqual(prev, next) ? prev : next;
  });

  const canvasPixelRef = computed<[number, number]>((prev = vec2()) => {
    const next = round(unref(canvasPositionRef), vec2(), Math.floor);
    return isEqual(prev, next) ? prev : next;
  });

  const isOverCanvasRef = computed<boolean>(() => {
    const canvasPoint = unref(canvasPixelRef);
    const [cWidth, cHeight] = unref(canvasSize);
    return isInsideBounds([cWidth, cHeight], canvasPoint);
  });

  onMounted(() => {
    const target = unref(targetRef);
    if (!target) return;
    target.addEventListener('pointermove', (e) => {
      screenPositionRef.value = [e.offsetX, e.offsetY];
    });
  });

  onUnmounted(() => {
    const target = unref(targetRef);
    if (!target) return;
  });

  return {
    screen: screenPositionRef,
    canvas: canvasPositionRef,
    pixel: canvasPixelRef,
    isOver: isOverCanvasRef,
  };
}
