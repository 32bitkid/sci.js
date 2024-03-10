export interface TypedArray extends ArrayLike<number> {
  readonly buffer: ArrayBufferLike;
  readonly byteLength: number;
  readonly byteOffset: number;
}
