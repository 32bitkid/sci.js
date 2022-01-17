import { ImageLike } from '@4bitlabs/sci0/dist/image-like';

import { eql } from './eql';

const PIXEL = [
  [0, 0, 1, 2, 2],
  [0, 0, 1, 2, 2],
  [3, 3, 4, 5, 5],
  [3, 3, 4, 5, 5],
  [6, 6, 7, 8, 8],
  [6, 6, 7, 8, 8],
].flat();

export const scale5x6 = (input: ImageLike): ImageLike => {
  const output = {
    data: new Uint8ClampedArray(input.width * 5 * (input.height * 6) * 4),
    width: input.width * 5,
    height: input.height * 6,
  };

  const src = new Uint32Array(
    input.data.buffer,
    input.data.byteOffset,
    input.data.byteLength >>> 2,
  );

  const dst = new Uint32Array(
    output.data.buffer,
    output.data.byteOffset,
    output.data.byteLength >>> 2,
  );

  const iStride = input.width;
  const oStride = output.width;

  for (let iy = 0; iy < input.height; iy += 1)
    for (let ix = 0; ix < input.width; ix += 1) {
      const e = iy * iStride + ix;

      const [uOk, rOk, lOk, dOk] = [
        iy - 1 >= 0,
        ix + 1 < input.width,
        ix - 1 >= 0,
        iy + 1 < input.height,
      ];

      const b = uOk ? (iy - 1) * iStride + ix : e;
      const d = lOk ? iy * iStride + (ix - 1) : e;
      const f = rOk ? iy * iStride + (ix + 1) : e;
      const h = dOk ? (iy + 1) * iStride + ix : e;

      const a = uOk && lOk ? (iy - 1) * iStride + (ix - 1) : e;
      const c = uOk && rOk ? (iy - 1) * iStride + (ix + 1) : e;
      const g = dOk && lOk ? (iy + 1) * iStride + (ix - 1) : e;
      const i = dOk && rOk ? (iy + 1) * iStride + (ix + 1) : e;

      const p = Array(9).fill(e);

      // IF D==B AND D!=H AND B!=F => 1=D
      if (eql(src, d, b) && !eql(src, d, h) && !eql(src, b, f)) p[0] = d;

      // IF (D==B AND D!=H AND B!=F AND E!=C) OR (B==F AND B!=D AND F!=H AND E!=A) => 2=B
      if (
        (eql(src, d, b) &&
          !eql(src, d, h) &&
          !eql(src, b, f) &&
          !eql(src, e, c)) ||
        (eql(src, b, f) &&
          !eql(src, b, d) &&
          !eql(src, f, h) &&
          !eql(src, e, a))
      )
        p[1] = b;

      // IF B==F AND B!=D AND F!=H => 3=F
      if (eql(src, b, f) && !eql(src, b, d) && !eql(src, f, h)) p[2] = f;

      // IF (H==D AND H!=F AND D!=B AND E!=A) OR (D==B AND D!=H AND B!=F AND E!=G) => 4=D
      if (
        (eql(src, h, d) &&
          !eql(src, h, f) &&
          !eql(src, d, b) &&
          !eql(src, e, a)) ||
        (eql(src, d, b) &&
          !eql(src, d, h) &&
          !eql(src, b, f) &&
          !eql(src, e, g))
      )
        p[3] = d;

      // IF (B==F AND B!=D AND F!=H AND E!=I) OR (F==H AND F!=B AND H!=D AND E!=C) => 6=F
      if (
        (eql(src, b, f) &&
          !eql(src, b, d) &&
          !eql(src, f, h) &&
          !eql(src, e, i)) ||
        (eql(src, f, h) &&
          !eql(src, f, b) &&
          !eql(src, h, d) &&
          !eql(src, e, c))
      )
        p[5] = f;
      // IF H==D AND H!=F AND D!=B => 7=D
      if (eql(src, h, d) && !eql(src, h, f) && !eql(src, d, b)) p[6] = d;

      // IF (F==H AND F!=B AND H!=D AND E!=G) OR (H==D AND H!=F AND D!=B AND E!=I) => 8=H
      if (
        (eql(src, f, h) &&
          !eql(src, f, b) &&
          !eql(src, h, d) &&
          !eql(src, e, g)) ||
        (eql(src, h, d) &&
          !eql(src, h, f) &&
          !eql(src, d, b) &&
          !eql(src, e, i))
      )
        p[7] = h;

      // IF F==H AND F!=B AND H!=D => 9=F
      if (eql(src, f, h) && !eql(src, f, b) && !eql(src, h, d)) p[8] = f;

      const oOffset = ix * 5 + iy * 6 * oStride;

      for (let oy = 0; oy < 6; oy++)
        for (let ox = 0; ox < 5; ox++) {
          const pIdx = PIXEL[oy * 5 + ox];
          dst[oOffset + ox + oy * oStride] = src[p[pIdx]];
        }
    }

  return output;
};
