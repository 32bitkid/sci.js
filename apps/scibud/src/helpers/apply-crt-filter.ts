import createContext from 'gl';
import { createCrtFromContext, type CrtRenderer } from '@4bitlabs/crt-lite';
import type { ImageDataLike } from '@4bitlabs/image';

const DEFAULT_CRT_OPTIONS = {
  Fx: -0.025,
  Fy: -0.035,
  S: 0.995,
  hBlur: 2.5,
  grain: 0,
  vignette: 1.0,
  scanLines: true,
};

function readPixels(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
): ImageDataLike {
  const stride = width * 4;

  const pixels = new Uint8ClampedArray(stride * height);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  const flippedPixels = new Uint8ClampedArray(width * height * 4);
  for (
    let src = 0, dst = (height - 1) * stride;
    src < stride * height;
    src += stride, dst -= stride
  ) {
    flippedPixels.set(pixels.subarray(src, src + stride), dst);
  }

  return {
    width,
    height,
    data: flippedPixels,
  };
}

export function optionalDeferredCrtFilter(enabled: boolean) {
  if (!enabled) return (source: ImageDataLike) => source;

  let gl: WebGL2RenderingContext | null = null;
  let renderer: CrtRenderer | null = null;

  return (source: ImageDataLike) => {
    const { width, height } = source;

    /* init */
    if (gl === null) {
      gl = createContext(width, height, {
        preserveDrawingBuffer: false,
        createWebGL2Context: true,
      });
    }
    if (renderer === null) {
      renderer = createCrtFromContext(gl, width, height);
    }

    renderer.update(source, DEFAULT_CRT_OPTIONS);
    return readPixels(gl, width, height);
  };
}

export function crtFilter(source: ImageDataLike): ImageDataLike {
  const { width, height } = source;

  const gl = createContext(width, height, {
    preserveDrawingBuffer: true,
    createWebGL2Context: true,
  });

  const { update } = createCrtFromContext(gl, width, height);
  update(source, DEFAULT_CRT_OPTIONS);
  return readPixels(gl, width, height);
}
