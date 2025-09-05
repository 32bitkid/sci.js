import type { ImageDataLike, ImageFilter } from '@4bitlabs/image';

// Adapted from http://www.quasimondo.com/BoxBlurForCanvas
const MUL = [
  1, 57, 41, 21, 203, 34, 97, 73, 227, 91, 149, 62, 105, 45, 39, 137, 241, 107,
  3, 173, 39, 71, 65, 238, 219, 101, 187, 87, 81, 151, 141, 133, 249, 117, 221,
  209, 197, 187, 177, 169, 5, 153, 73, 139, 133, 127, 243, 233, 223, 107, 103,
  99, 191, 23, 177, 171, 165, 159, 77, 149, 9, 139, 135, 131, 253, 245, 119,
  231, 224, 109, 211, 103, 25, 195, 189, 23, 45, 175, 171, 83, 81, 79, 155, 151,
  147, 9, 141, 137, 67, 131, 129, 251, 123, 30, 235, 115, 113, 221, 217, 53, 13,
  51, 50, 49, 193, 189, 185, 91, 179, 175, 43, 169, 83, 163, 5, 79, 155, 19, 75,
  147, 145, 143, 35, 69, 17, 67, 33, 65, 255, 251, 247, 243, 239, 59, 29, 229,
  113, 111, 219, 27, 213, 105, 207, 51, 201, 199, 49, 193, 191, 47, 93, 183,
  181, 179, 11, 87, 43, 85, 167, 165, 163, 161, 159, 157, 155, 77, 19, 75, 37,
  73, 145, 143, 141, 35, 138, 137, 135, 67, 33, 131, 129, 255, 63, 250, 247, 61,
  121, 239, 237, 117, 29, 229, 227, 225, 111, 55, 109, 216, 213, 211, 209, 207,
  205, 203, 201, 199, 197, 195, 193, 48, 190, 47, 93, 185, 183, 181, 179, 178,
  176, 175, 173, 171, 85, 21, 167, 165, 41, 163, 161, 5, 79, 157, 78, 154, 153,
  19, 75, 149, 74, 147, 73, 144, 143, 71, 141, 140, 139, 137, 17, 135, 134, 133,
  66, 131, 65, 129, 1,
];

const SHG = [
  0, 9, 10, 10, 14, 12, 14, 14, 16, 15, 16, 15, 16, 15, 15, 17, 18, 17, 12, 18,
  16, 17, 17, 19, 19, 18, 19, 18, 18, 19, 19, 19, 20, 19, 20, 20, 20, 20, 20,
  20, 15, 20, 19, 20, 20, 20, 21, 21, 21, 20, 20, 20, 21, 18, 21, 21, 21, 21,
  20, 21, 17, 21, 21, 21, 22, 22, 21, 22, 22, 21, 22, 21, 19, 22, 22, 19, 20,
  22, 22, 21, 21, 21, 22, 22, 22, 18, 22, 22, 21, 22, 22, 23, 22, 20, 23, 22,
  22, 23, 23, 21, 19, 21, 21, 21, 23, 23, 23, 22, 23, 23, 21, 23, 22, 23, 18,
  22, 23, 20, 22, 23, 23, 23, 21, 22, 20, 22, 21, 22, 24, 24, 24, 24, 24, 22,
  21, 24, 23, 23, 24, 21, 24, 23, 24, 22, 24, 24, 22, 24, 24, 22, 23, 24, 24,
  24, 20, 23, 22, 23, 24, 24, 24, 24, 24, 24, 24, 23, 21, 23, 22, 23, 24, 24,
  24, 22, 24, 24, 24, 23, 22, 24, 24, 25, 23, 25, 25, 23, 24, 25, 25, 24, 22,
  25, 25, 25, 24, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 23,
  25, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 24, 22, 25, 25, 23, 25, 25,
  20, 24, 25, 24, 25, 25, 22, 24, 25, 24, 25, 24, 25, 25, 24, 25, 25, 25, 25,
  22, 25, 25, 25, 24, 25, 24, 25, 18,
];

export function boxBlur(radius: number): ImageFilter {
  radius = radius >>> 0;
  return function boxBlurFilter(source: ImageDataLike): ImageDataLike {
    const { width, height } = source;

    const pixels = source.data;

    const wm = width - 1;
    const hm = height - 1;
    const rad1 = radius + 1;

    let rSum: number,
      gSum: number,
      bSum: number,
      x: number,
      y: number,
      i: number,
      p1: number,
      p2: number,
      yp: number,
      yi: number,
      yw: number;

    const r = new Uint32Array(width * height);
    const g = new Uint32Array(width * height);
    const b = new Uint32Array(width * height);

    const mul = MUL[radius];
    const shift = SHG[radius];

    const vmin = new Uint32Array(Math.max(width, height));
    const vmax = new Uint32Array(Math.max(width, height));

    yw = yi = 0;

    for (y = 0; y < height; y++) {
      rSum = pixels[yw] * rad1;
      gSum = pixels[yw + 1] * rad1;
      bSum = pixels[yw + 2] * rad1;

      for (i = 1; i <= radius; i++) {
        let p = yw + ((i > wm ? wm : i) << 2);
        rSum += pixels[p++];
        gSum += pixels[p++];
        bSum += pixels[p++];
      }

      for (x = 0; x < width; x++) {
        r[yi] = rSum;
        g[yi] = gSum;
        b[yi] = bSum;

        if (y === 0) {
          const right = x + rad1;
          vmin[x] = (right < wm ? right : wm) << 2;
          const left = x - radius;
          vmax[x] = left > 0 ? left << 2 : 0;
        }

        p1 = yw + vmin[x];
        p2 = yw + vmax[x];

        rSum += pixels[p1++] - pixels[p2++];
        gSum += pixels[p1++] - pixels[p2++];
        bSum += pixels[p1++] - pixels[p2++];

        yi++;
      }
      yw += width << 2;
    }

    for (x = 0; x < width; x++) {
      yp = x;
      rSum = r[yp] * rad1;
      gSum = g[yp] * rad1;
      bSum = b[yp] * rad1;

      for (i = 1; i <= radius; i++) {
        yp += i > hm ? 0 : width;
        rSum += r[yp];
        gSum += g[yp];
        bSum += b[yp];
      }

      yi = x << 2;
      for (y = 0; y < height; y++) {
        pixels[yi] = (rSum * mul) >>> shift;
        pixels[yi + 1] = (gSum * mul) >>> shift;
        pixels[yi + 2] = (bSum * mul) >>> shift;

        if (x === 0) {
          const bottom = y + rad1;
          vmin[y] = (bottom < hm ? bottom : hm) * width;
          const top = y - radius;
          vmax[y] = top > 0 ? top * width : 0;
        }

        p1 = x + vmin[y];
        p2 = x + vmax[y];

        rSum += r[p1] - r[p2];
        gSum += g[p1] - g[p2];
        bSum += b[p1] - b[p2];

        yi += width << 2;
      }
    }

    return source;
  };
}
