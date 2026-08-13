export function* range(start: number, end: number, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

export function* mapRange<T>(
  start: number,
  end: number,
  func: (i: number) => T | null,
  step = 1,
): Generator<T> {
  for (let i = start; i <= end; i += step) {
    const result = func(i);
    if (result !== null) yield result;
  }
}
