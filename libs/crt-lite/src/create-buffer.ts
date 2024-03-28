import { assertNotNull } from './assert-not-null';

export function createBuffer(
  gl: WebGL2RenderingContext,
  type: typeof gl.ARRAY_BUFFER | typeof gl.ELEMENT_ARRAY_BUFFER,
  data: ArrayBufferView,
) {
  const buffer = gl.createBuffer();
  assertNotNull(buffer);
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, data, gl.STATIC_DRAW);
  gl.bindBuffer(type, null);
  return buffer;
}