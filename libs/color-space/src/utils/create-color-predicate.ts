export function createColorPredicate<
  T extends [string, number, number, number, number?],
>(
  NAME: string,
  ids: T[0][],
  aRange: [number, number] = [-Infinity, Infinity],
  bRange: [number, number] = [-Infinity, Infinity],
  cRange: [number, number] = [-Infinity, Infinity],
): (it: unknown) => it is T {
  return {
    [NAME](it: unknown): it is T {
      if (!Array.isArray(it)) return false;

      const type: unknown = it[0];
      if (typeof type !== 'string') return false;
      if (!ids.includes(type)) return false;

      if (!(it.length === 4 || it.length === 5)) return false;

      const a: unknown = it[1];
      const b: unknown = it[2];
      const c: unknown = it[3];
      if (typeof a !== 'number') return false;
      if (typeof b !== 'number') return false;
      if (typeof c !== 'number') return false;

      if (a < aRange[0] || a > aRange[1]) return false;
      if (b < bRange[0] || b > bRange[1]) return false;
      if (c < cRange[0] || c > cRange[1]) return false;

      const alpha: unknown = it[4];
      if (!(typeof alpha === 'undefined' || typeof alpha === 'number')) {
        return false;
      }

      return alpha === undefined || (alpha >= 0 && alpha <= 1);
    },
  }[NAME];
}
