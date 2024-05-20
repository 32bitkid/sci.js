import { Ref, watch, onUnmounted, triggerRef } from 'vue';

import { useDebouncedRef } from './useDebouncedRef.ts';

export function useResizeWatcher<T extends HTMLElement>(
  refEl: Ref<T | null>,
  delay?: number,
) {
  const resolution = useDebouncedRef<[width: number, height: number]>(
    [0, 0],
    delay,
  );

  const visiblityHandler = () => {
    if (!document.hidden) {
      console.log('trigger refocus');
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
