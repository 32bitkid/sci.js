export interface ResourceHeader {
  readonly id: number;
  readonly packedSize: number;
  readonly actualSize: number;
  /**
   * The compression algorithm used for this resource.
   * @see {@link decompress}
   */
  readonly compression: number;
}
