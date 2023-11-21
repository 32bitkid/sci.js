export const repeat = <T>(n: number, fn: (i: number) => T): T[] =>
  Array(n)
    .fill(null)
    .map((_, i) => fn(i));
