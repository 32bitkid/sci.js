export type ReadonlyBytes = Omit<
  Uint8Array | Uint8ClampedArray,
  'copyWithin' | 'fill' | 'reverse' | 'set' | 'sort'
> & { readonly [n: number]: number };

export type Sequence = ReadonlyBytes;
