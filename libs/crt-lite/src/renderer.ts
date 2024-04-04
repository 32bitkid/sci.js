import { assertNotNull } from './assert-not-null';
import { vertexShaderSource } from './vertex-shader-source';
import { fragShaderSource } from './frag-shader-source';
import { compileShader } from './compile-shader';
import { createBuffer } from './create-buffer';
import { updateTexture } from './update-texture';
import * as Model from './model';
import { type ImageDataLike } from './image-data-like';
import { type CrtUpdateFn, type CrtUpdateOptions } from './update-function';

export interface CreateCrtRenderOptions {
  maxHBlur?: number;
  renderDefaults?: CrtUpdateOptions;
  contextOptions?: WebGLContextAttributes;
}

export interface CrtRenderer {
  update: CrtUpdateFn;
}

export function createCrtRenderer(
  canvasEl: HTMLCanvasElement,
  {
    contextOptions,
    maxHBlur,
    renderDefaults: defaults,
  }: CreateCrtRenderOptions = {},
): CrtRenderer {
  const gl = canvasEl.getContext('webgl2', {
    desynchronized: true,
    ...contextOptions,
  })!;

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragShader = compileShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragShaderSource({ maxHBlur }),
  );

  const program = gl.createProgram();
  assertNotNull(program);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const attrs = {
    aVertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
    aTextureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
    uSampler: gl.getUniformLocation(program, 'uSampler'),

    u_Lens: gl.getUniformLocation(program, 'u_Lens'),
    u_resolution: gl.getUniformLocation(program, 'u_resolution'),
    u_textureSize: gl.getUniformLocation(program, 'u_textureSize'),
    u_monitorRes: gl.getUniformLocation(program, 'u_monitorRes'),
    u_hBlurSize: gl.getUniformLocation(program, 'u_hBlurSize'),
    u_grainAmount: gl.getUniformLocation(program, 'u_grainAmount'),
    u_vignetteAmount: gl.getUniformLocation(program, 'u_vignetteAmount'),
    u_scanLines: gl.getUniformLocation(program, 'u_scanLines'),
  };

  const buffers = {
    vertex: createBuffer(gl, gl.ARRAY_BUFFER, Model.VERTEX),
    index: createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, Model.INDICES),
    texture: createBuffer(gl, gl.ARRAY_BUFFER, Model.TEXTURE_COORDS),
  };

  const texture = gl.createTexture();
  assertNotNull(texture);
  updateTexture(gl, texture, {
    data: Uint8ClampedArray.of(255, 0, 0, 255),
    width: 1,
    height: 1,
  });
  gl.bindTexture(gl.TEXTURE_2D, null);

  const update = function renderCanvas(
    imageData: ImageDataLike,
    options: CrtUpdateOptions = {},
  ) {
    let { width, height } = canvasEl.getBoundingClientRect();

    const imageAspectRatio = imageData.width / imageData.height;
    const canvasAspectRatio = width / height;
    if (imageAspectRatio > canvasAspectRatio) {
      width = height * imageAspectRatio;
    } else {
      height = width * (1 / imageAspectRatio);
    }

    canvasEl.width = width;
    canvasEl.height = height;
    gl.viewport(0, 0, canvasEl.width, canvasEl.height);

    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enableVertexAttribArray(attrs.aVertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
    gl.vertexAttribPointer(attrs.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(attrs.aTextureCoord);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texture);
    gl.vertexAttribPointer(attrs.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    updateTexture(gl, texture, imageData);

    gl.uniform1i(attrs.uSampler, 0);
    gl.uniform2fv(attrs.u_resolution, [width, height]);
    gl.uniform2fv(attrs.u_textureSize, [imageData.width, imageData.height]);
    gl.uniform2fv(attrs.u_monitorRes, [320, 200]);

    {
      const {
        Fx = -0.0,
        Fy = -0.0,
        S = 1.0,
        hBlur = 0.0,
        grain = 0.0,
        vignette = 0.0,
        scanLines = true,
      } = { ...defaults, ...options };

      gl.uniform3fv(attrs.u_Lens, [Fx, Fy, S]);
      gl.uniform1f(attrs.u_hBlurSize, hBlur);
      gl.uniform1f(attrs.u_grainAmount, grain);
      gl.uniform1f(attrs.u_vignetteAmount, vignette);
      gl.uniform1i(attrs.u_scanLines, scanLines ? 1.0 : 0.0);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
    gl.drawElements(gl.TRIANGLES, Model.INDICES.length, gl.UNSIGNED_BYTE, 0);
  };

  return {
    update,
  };
}
