export interface ResourceHeader<T extends number = number> {
  readonly id: number;
  readonly compressedSize: number;
  readonly uncompressedSize: number;
  readonly compression: T;
}
