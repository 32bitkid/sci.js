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

      const [type] = it;
      if (!ids.includes(type)) return false;

      if (!(it.length === 4 || it.length === 5)) return false;

      const [, a, b, c] = it;
      if (typeof a !== 'number') return false;
      if (typeof b !== 'number') return false;
      if (typeof c !== 'number') return false;

      if (a < aRange[0] || a > aRange[1]) return false;
      if (b < bRange[0] || b > bRange[1]) return false;
      if (c < cRange[0] || c > cRange[1]) return false;

      const [, , , , alpha] = it;
      if (!(typeof alpha === 'undefined' || typeof alpha === 'number')) {
        return false;
      }

      if (!(alpha === undefined || (alpha >= 0 && alpha <= 1))) return false;

      return true;
    },
  }[NAME];
}
