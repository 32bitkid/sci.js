import { type ImageDataLike, type ImageFilter } from '@4bitlabs/image';

export function makeGaussKernel(sigma: number) {
  const GAUSSIAN_KERNEL = 6.0;
  const dim = ~~Math.max(3.0, GAUSSIAN_KERNEL * sigma);
  const sqrtSigmaPi2 = Math.sqrt(Math.PI * 2.0) * sigma;
  const s2 = 2.0 * sigma * sigma;

  let sum = 0.0;

  const kernel = new Float32Array(dim - (~dim & 1)); // Make it odd number
  const half = kernel.length >> 1;
  for (let j = 0, i = -half; j < kernel.length; i++, j++) {
    kernel[j] = Math.exp(-(i * i) / s2) / sqrtSigmaPi2;
    sum += kernel[j];
  }
  // Normalize the gaussian kernel to prevent image darkening/brightening
  for (let i = 0; i < dim; i++) {
    kernel[i] /= sum;
  }
  return kernel;
}

function convolute(
  pixels: ImageDataLike,
  hKernel: Float32Array,
  vKernel: Float32Array,
  ch: number,
) {
  const data = pixels.data;
  const w = pixels.width;
  const h = pixels.height;
  const buff = new Uint8Array(w * h);
  const mk = Math.floor(hKernel.length / 2);
  const kl = hKernel.length;

  // First step process columns
  for (let j = 0, hw = 0; j < h; j++, hw += w) {
    for (let i = 0; i < w; i++) {
      let sum = 0;
      for (let k = 0; k < kl; k++) {
        let col = i + (k - mk);
        col = col < 0 ? 0 : col >= w ? w - 1 : col;
        sum += data[(hw + col) * 4 + ch] * hKernel[k];
      }
      buff[hw + i] = sum;
    }
  }

  // Second step process rows
  for (let j = 0, offset = 0; j < h; j++, offset += w) {
    for (let i = 0; i < w; i++) {
      let sum = 0;
      for (let k = 0; k < kl; k++) {
        let row = j + (k - mk);
        row = row < 0 ? 0 : row >= h ? h - 1 : row;
        sum += buff[row * w + i] * vKernel[k];
      }
      const off = (j * w + i) * 4;
      data[off + ch] = sum;
    }
  }
}

export function gaussBlur(sigma: number): ImageFilter {
  const kernel = makeGaussKernel(sigma);
  return function gaussBlur(pixels: ImageDataLike): ImageDataLike {
    for (let ch = 0; ch < 3; ch++) {
      convolute(pixels, kernel, kernel, ch);
    }
    return pixels;
  };
}
