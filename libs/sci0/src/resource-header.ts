export interface ResourceHeader {
  readonly id: number;
  readonly packedSize: number;
  readonly actualSize: number;
  readonly compression: number;
}

export const parseHeaderFrom = (bytes: Uint8Array): ResourceHeader => {
  const view = new DataView(bytes.buffer);
  return {
    id: view.getUint16(0, true),
    packedSize: view.getUint16(2, true),
    actualSize: view.getUint16(4, true),
    compression: view.getUint16(6, true),
  };
};

export const getPayloadLength = ({ packedSize }: ResourceHeader) =>
  packedSize - 4;
