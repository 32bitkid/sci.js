import { watch, onUnmounted, triggerRef, ShallowRef } from 'vue';

import { useDebouncedRef } from './useDebouncedRef';

export function useResizeWatcher<T extends HTMLElement>(
  refEl: ShallowRef<T | null>,
  delay?: number,
) {
  const resolution = useDebouncedRef<[width: number, height: number]>(
    [-1, -1],
    delay,
  );

  const visiblityHandler = () => {
    if (!document.hidden) {
      triggerRef(resolution);
    }
  };

  document.addEventListener('visibilitychange', visiblityHandler);

  const watcher = new ResizeObserver((els) => {
    const match = els.find((it) => it.target === refEl.value);
    resolution.value = [
      match?.contentRect.width ?? 0,
      match?.contentRect.height ?? 0,
    ];
  });

  watch(refEl, (next, prev) => {
    if (prev) watcher.unobserve(prev);
    if (next) watcher.observe(next);
  });

  onUnmounted(() => {
    watcher.disconnect();
    document.removeEventListener('visibilitychange', visiblityHandler);
  });

  return resolution;
}
