export function* range(start: number, end: number, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

export function* mapRange<T>(
  start: number,
  end: number,
  func: (i: number) => T,
  step = 1,
) {
  for (let i = start; i <= end; i += step) {
    yield func(i);
  }
}
