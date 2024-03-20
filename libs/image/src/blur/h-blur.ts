import { ImageFilter } from '../image-filter';
import { ImageDataLike } from '../image-data-like';
import { makeGaussKernel } from './gauss-blur';

function convolute(image: ImageDataLike, kernel: Float32Array) {
  const kLen = kernel.length;
  const halfKen = (kLen - 1) >> 1;
  const { width, height } = image;
  const total = width * height * 4;
  const rgb = new Float64Array(3);
  const pixel = image.data;

  const stride = width * 4;

  for (let offset = 0; offset < total; offset += stride) {
    for (let x = 0; x < width; x += 1) {
      rgb[0] = 0;
      rgb[1] = 0;
      rgb[2] = 0;
      for (let i = 0; i < kLen; i++) {
        let ix = x + (i - halfKen);
        if (ix < 0) ix = -ix;
        if (ix >= width) ix = width - 1 - (x - width);

        const kv = kernel[i];
        rgb[0] += pixel[offset + 4 * ix] * kv;
        rgb[1] += pixel[offset + 4 * ix + 1] * kv;
        rgb[2] += pixel[offset + 4 * ix + 2] * kv;
      }
      pixel[offset + 4 * x] = rgb[0];
      pixel[offset + 4 * x + 1] = rgb[1];
      pixel[offset + 4 * x + 2] = rgb[2];
    }
  }
}

export function hBlur(sigma: number): ImageFilter {
  const kernel = makeGaussKernel(sigma);

  return function hBlur(pixels: ImageDataLike): ImageDataLike {
    if (sigma <= 0) return pixels;
    convolute(pixels, kernel);
    return pixels;
  };
}
