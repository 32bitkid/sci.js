import { ResourceHeader } from '../models/resource-header';

export const parseHeaderFrom = (bytes: Uint8Array): ResourceHeader => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return {
    id: view.getUint16(0, true),
    packedSize: view.getUint16(2, true),
    actualSize: view.getUint16(4, true),
    compression: view.getUint16(6, true),
  };
};

export const getPayloadLength = ({ packedSize }: ResourceHeader): number =>
  packedSize - 4;
