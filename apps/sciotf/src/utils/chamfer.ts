export type Triplet<T> = [previous: T, self: T, next: T, idx: number];

export function* triplets<T>(points: T[]): IterableIterator<Triplet<T>> {
  const length = points.length;
  for (let i = 0; i < length; i++) {
    const prev = (i - 1 + length) % length;
    const next = (i + 1) % length;
    yield [points[prev], points[i], points[next], i];
  }
}

export function chamfer(
  points: (readonly [number, number])[],
  scalar: number,
): [number, number][] {
  const nPoints: [number, number][] = [];
  for (const [a, b, c] of triplets(points)) {
    const ba = [a[0] - b[0], a[1] - b[1]];
    const lenBA = Math.hypot(ba[0], ba[1]);

    const bc = [c[0] - b[0], c[1] - b[1]];
    const lenBC = Math.hypot(bc[0], bc[1]);

    const dPrev = Math.min(scalar, lenBA / 2);
    const dNext = Math.min(scalar, lenBC / 2);

    nPoints.push([
      b[0] + (ba[0] / lenBA) * dPrev,
      b[1] + (ba[1] / lenBA) * dPrev,
    ]);

    nPoints.push([
      b[0] + (bc[0] / lenBC) * dNext,
      b[1] + (bc[1] / lenBC) * dNext,
    ]);
  }
  return nPoints;
}
