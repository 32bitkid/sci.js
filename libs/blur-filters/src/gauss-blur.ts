import { type ImageDataLike, type ImageFilter } from '@4bitlabs/image';
import { makeGaussKernel } from './make-gauss-kernel';

function convolute(
  pixels: ImageDataLike,
  hKernel: Float64Array,
  vKernel: Float64Array,
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
  return function gaussBlurFilter(pixels: ImageDataLike): ImageDataLike {
    for (let ch = 0; ch < 3; ch++) {
      convolute(pixels, kernel, kernel, ch);
    }
    return pixels;
  };
}
