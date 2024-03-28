export function assertNotNull<T>(it: T | null): asserts it is T {
  if (it === null) throw new Error('value is null');
}
