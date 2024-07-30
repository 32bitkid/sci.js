import { assertNotNull } from './assert-not-null';
import { assertCompilation } from './assert-compilation';

export function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  assertNotNull(shader);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  assertCompilation(gl, shader);
  return shader;
}
