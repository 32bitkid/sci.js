export interface ResourceHeader {
  readonly id: number;
  readonly packedSize: number;
  readonly actualSize: number;
  readonly compression: number;
}
