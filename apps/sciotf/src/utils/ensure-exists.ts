export function ensureExists<T>(
  it: T | null | undefined,
  message: string = 'value is not defined',
): asserts it is T {
  if (it === null || it === undefined) {
    panic(message);
  }
}

export function panic(message: string = 'Something went wrong!'): never {
  console.error(message);
  process.exit(-1);
}
