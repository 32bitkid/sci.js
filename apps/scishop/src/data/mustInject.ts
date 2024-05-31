import { InjectionKey } from '@vue/runtime-core';
import { inject } from 'vue';

export const mustInject = <T>(
  key: InjectionKey<T>,
  message = 'injection error',
) => {
  const value = inject(key);
  if (value === undefined)
    throw new Error(`${message}: ${String(key)} is not set`);
  return value;
};
