export function assertCompilation<T extends WebGLShader>(
  gl: WebGL2RenderingContext,
  it: T,
): asserts it is T {
  if (!gl.getShaderParameter(it, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(it) ?? 'unknown error';
    gl.deleteShader(it);
    throw new Error(`Shader Error: ${log}`);
  }
}
