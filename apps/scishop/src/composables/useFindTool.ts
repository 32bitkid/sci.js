import { computed, onMounted, onUnmounted, Ref, unref } from 'vue';

import { RenderResult } from '@4bitlabs/sci0';
import { mustInject } from '../data/mustInject.ts';
import { pointersKey, stageOptionsKey, toolKey } from '../data/keys.ts';
import { CursorPosition } from './useCursorWatcher.ts';

const MAX = ~0 >>> 0;

export function useFindTool(
  target: Ref<HTMLElement | null>,
  pixels: Ref<RenderResult>,
  pos: CursorPosition,
) {
  const { selectedIdx } = mustInject(pointersKey);
  const toolRef = mustInject(toolKey);
  const { canvasSize } = mustInject(stageOptionsKey);

  const commandUnderPosition = computed(() => {
    const isOver = unref(pos.isOver);
    if (!isOver) return -1;

    const [x, y] = unref(pos.pixel);
    const [sWidth] = unref(canvasSize);
    const { tBuffer } = unref(pixels);

    const cmd = tBuffer[y * sWidth + x];
    return cmd !== MAX ? cmd : -1;
  });

  const handleClick = () => {
    if (unref(toolRef) !== 'find') return;
    const val = unref(commandUnderPosition);
    if (val === -1) return;

    selectedIdx.value = val;
    toolRef.value = 'select';
  };

  onMounted(() => {
    const el = unref(target);
    if (!el) return;
    el.addEventListener('click', handleClick);
  });

  onUnmounted(() => {
    const el = unref(target);
    if (!el) return;
    el.removeEventListener('click', handleClick);
  });
}
