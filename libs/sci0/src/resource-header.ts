export interface ResourceHeader<T extends number = number> {
  readonly id: number;
  readonly packedSize: number;
  readonly actualSize: number;
  readonly compression: T;
}

export const parseHeaderFrom = <T extends number = number>(
  bytes: Uint8Array,
): ResourceHeader<T> => {
  const view = new DataView(bytes.buffer);
  return {
    id: view.getUint16(0, true),
    packedSize: view.getUint16(2, true),
    actualSize: view.getUint16(4, true),
    compression: view.getUint16(6, true) as T,
  };
};

export const getPayloadLength = ({ packedSize }: ResourceHeader) =>
  packedSize - 4;
