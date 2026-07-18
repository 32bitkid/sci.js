import { assertNotNull } from './assert-not-null.js';
import { assertCompilation } from './assert-compilation.js';

export function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  assertNotNull(shader, 'shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  assertCompilation(gl, shader);
  return shader;
}
