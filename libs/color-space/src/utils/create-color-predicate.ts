import { ColorTuple } from '../tuples/color-tuple';

/**
 * Checks if an `unknown` value is a valid color tuple
 */
export type ColorPredicate<T extends ColorTuple> = (
  value: unknown,
) => value is T;

/**
 *
 * @param NAME The name of the color predicate.
 * @param ids A list of valid color tuple types.
 * @param aRange
 * @param bRange
 * @param cRange
 */
export function createColorPredicate<T extends ColorTuple>(
  NAME: string,
  ids: T[0][],
  aRange: [number, number] | ((val: number) => boolean) = [-Infinity, Infinity],
  bRange: [number, number] | ((val: number) => boolean) = [-Infinity, Infinity],
  cRange: [number, number] | ((val: number) => boolean) = [-Infinity, Infinity],
): ColorPredicate<T> {
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

      if (Array.isArray(aRange)) {
        if (a < aRange[0] || a > aRange[1]) return false;
      } else if (!aRange(a)) return false;

      if (Array.isArray(bRange)) {
        if (b < bRange[0] || b > bRange[1]) return false;
      } else if (!bRange(b)) return false;

      if (Array.isArray(cRange)) {
        if (c < cRange[0] || c > cRange[1]) return false;
      } else if (!cRange(c)) return false;

      const alpha: unknown = it[4];
      if (!(typeof alpha === 'undefined' || typeof alpha === 'number')) {
        return false;
      }

      return alpha === undefined || (alpha >= 0 && alpha <= 1);
    },
  }[NAME];
}
