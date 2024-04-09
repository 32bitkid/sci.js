export const assign = <T extends [unknown, number, number, number, number?]>(
  out: T,
  v1: number | undefined,
  v2: number | undefined,
  v3: number | undefined,
  alpha: number | undefined,
): T => {
  if (v1 !== undefined) out[1] = v1;
  if (v2 !== undefined) out[2] = v2;
  if (v3 !== undefined) out[3] = v3;

  if (typeof alpha === 'number') {
    out[4] = alpha;
    return out;
  }

  if (out.length === 5) {
    out.pop();
  }
  return out;
};
