import { Sequence } from './shared';

export const concat = (parts: Sequence[]): Uint8Array => {
  const len = parts.reduce((sum, it) => sum + it.length, 0);
  const result = new Uint8Array(len);
  parts.reduce((sum, it) => {
    result.set(it, sum);
    return sum + it.length;
  }, 0);
  return result;
};
