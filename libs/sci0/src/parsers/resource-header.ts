import { ResourceHeader } from '../models/resource-header';

export const parseHeaderFrom = (
  bytes: Uint8Array,
  offset: number = 0,
): ResourceHeader => {
  const view = new DataView(
    bytes.buffer,
    bytes.byteOffset + offset,
    bytes.byteLength - offset,
  );

  const id = view.getUint16(0, true);
  const packedSize = view.getUint16(2, true);
  const actualSize = view.getUint16(4, true);
  const compression = view.getUint16(6, true);

  return {
    id,
    packedSize,
    actualSize,
    compression,
  };
};

export const parseHeaderWithPayload = (
  bytes: Uint8Array,
  offset: number = 0,
): [ResourceHeader, Uint8Array] => {
  const header = parseHeaderFrom(bytes, offset);
  const start = offset + 8;
  const end = start + header.packedSize - 4;
  return [header, bytes.subarray(start, end)];
};
