import { customRef } from 'vue';

export function useDebouncedRef<T>(value: T, delay = 100) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return customRef((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newValue) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        value = newValue;
        trigger();
      }, delay);
    },
  }));
}
