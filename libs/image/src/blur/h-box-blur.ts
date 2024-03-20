import { ImageFilter } from '../image-filter';
import { ImageDataLike } from '../image-data-like';
import { NumericDeque } from '@4bitlabs/numeric-deque';

function convolute(image: ImageDataLike, kLen: number, win: NumericDeque) {
  const halfKen = (kLen - 1) >> 1;
  const { width, height } = image;

  const stride = width * 4;
  const total = stride * height;

  const pixels = image.data;

  for (let offset = 0; offset < total; offset += stride) {
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;

    for (let i = 0; i < kLen; i++) {
      let ix = i - halfKen;
      if (ix < 0) ix = -ix;
      if (ix > width) ix = width - 1 - (i - width);

      const idx = offset + ix * 4;

      rSum += pixels[idx];
      gSum += pixels[idx + 1];
      bSum += pixels[idx + 2];

      win.push(pixels[idx]);
      win.push(pixels[idx + 1]);
      win.push(pixels[idx + 2]);
    }

    for (let x = 0; x < width; x += 1) {
      // Assign pixel
      pixels[offset + x * 4] = rSum / kLen;
      pixels[offset + x * 4 + 1] = gSum / kLen;
      pixels[offset + x * 4 + 2] = bSum / kLen;

      // Shift off old pixel
      rSum -= win.shift();
      gSum -= win.shift();
      bSum -= win.shift();

      // Get next pixel
      let ix = x + halfKen;
      if (ix > width) ix = width - 1 - (ix - width);

      const idx = offset + ix * 4;

      const nR = pixels[idx];
      const nG = pixels[idx + 1];
      const nB = pixels[idx + 2];

      // Add it to the sum
      rSum += nR;
      gSum += nG;
      bSum += nB;

      if (x + kLen < width) {
        // Push it onto the window
        win.push(nR);
        win.push(nG);
        win.push(nB);
      }
    }
  }
}

export function hBoxBlur(size: number): ImageFilter {
  const wSize = size + (~size & 1);

  const rgbWindow = new NumericDeque(wSize * 4);

  return function hBlur(pixels: ImageDataLike): ImageDataLike {
    convolute(pixels, wSize, rgbWindow);
    return pixels;
  };
}
