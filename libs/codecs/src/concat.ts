export const concat = (
  parts: (Uint8Array | Uint8ClampedArray)[],
): Uint8Array => {
  const len = parts.reduce((sum, it) => sum + it.length, 0);
  const result = new Uint8Array(len);
  parts.reduce((sum, it) => {
    result.set(it, sum);
    return sum + it.length;
  }, 0);
  return result;
};
