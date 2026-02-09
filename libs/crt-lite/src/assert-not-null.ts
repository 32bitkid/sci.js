export function assertNotNull<T>(
  it: T | null,
  identifier = 'value',
): asserts it is T {
  if (it === null) throw new Error(`${identifier} is null`);
}
