import { TypedArray } from '../typed-array';

export function copyBuffer(
  source: TypedArray | ArrayBuffer,
  dest: ArrayBuffer,
): void {
  const destBytes = new Uint8Array(dest);
  const sourceBytes =
    source instanceof ArrayBuffer ? new Uint8Array(source) : source;
  destBytes.set(sourceBytes);
}
