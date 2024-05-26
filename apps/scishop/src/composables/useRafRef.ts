import { customRef } from 'vue';

export function useRafRef<T>(initialValue: T) {
  let value = initialValue;
  let rafHandle: number | null = null;

  return customRef((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newValue) {
      if (rafHandle) cancelAnimationFrame(rafHandle);
      rafHandle = requestAnimationFrame(() => {
        value = newValue;
        trigger();
        rafHandle = null;
      });
    },
  }));
}
