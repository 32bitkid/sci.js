import { ImageLike } from '@4bitlabs/sci0/dist/image-like';

const eql = (source: Uint8ClampedArray, a: number, b: number): boolean =>
  source[a] === source[b] &&
  source[a + 1] === source[b + 1] &&
  source[a + 2] === source[b + 2] &&
  source[a + 3] === source[b + 3];

// TODO update to use Uint32 to read an entire pixel at once.
export const scale3x = (input: ImageLike): ImageLike => {
  const output = {
    data: new Uint8ClampedArray(input.width * 3 * (input.height * 3) * 4),
    width: input.width * 3,
    height: input.height * 3,
  };

  const iStride = input.width * 4;
  const oStride = output.width * 4;

  for (let iy = 0; iy < input.height; iy += 1)
    for (let ix = 0; ix < input.width; ix += 1) {
      const e = iy * iStride + (ix << 2);

      const [uOk, rOk, lOk, dOk] = [
        iy - 1 >= 0,
        ix + 1 < input.width,
        ix - 1 >= 0,
        iy + 1 < input.height,
      ];

      const b = uOk ? (iy - 1) * iStride + (ix << 2) : e;
      const d = lOk ? iy * iStride + ((ix - 1) << 2) : e;
      const f = rOk ? iy * iStride + ((ix + 1) << 2) : e;
      const h = dOk ? (iy + 1) * iStride + (ix << 2) : e;

      const a = uOk && lOk ? (iy - 1) * iStride + ((ix - 1) << 2) : e;
      const c = uOk && rOk ? (iy - 1) * iStride + ((ix + 1) << 2) : e;
      const g = dOk && lOk ? (iy + 1) * iStride + ((ix - 1) << 2) : e;
      const i = dOk && rOk ? (iy + 1) * iStride + ((ix + 1) << 2) : e;

      const { data: s } = input;

      // IF D==B AND D!=H AND B!=F => 1=D
      const p1 = eql(s, d, b) && !eql(s, d, h) && !eql(s, b, f) ? d : e;

      // IF (D==B AND D!=H AND B!=F AND E!=C) OR (B==F AND B!=D AND F!=H AND E!=A) => 2=B
      const p2 =
        (eql(s, d, b) && !eql(s, d, h) && !eql(s, b, f) && !eql(s, e, c)) ||
        (eql(s, b, f) && !eql(s, b, d) && !eql(s, f, h) && !eql(s, e, a))
          ? b
          : e;

      // IF B==F AND B!=D AND F!=H => 3=F
      const p3 = eql(s, b, f) && !eql(s, b, d) && !eql(s, f, h) ? f : e;

      // IF (H==D AND H!=F AND D!=B AND E!=A) OR (D==B AND D!=H AND B!=F AND E!=G) => 4=D
      const p4 =
        (eql(s, h, d) && !eql(s, h, f) && !eql(s, d, b) && !eql(s, e, a)) ||
        (eql(s, d, b) && !eql(s, d, h) && !eql(s, b, f) && !eql(s, e, g))
          ? d
          : e;

      // 5=E
      const p5 = e;

      // IF (B==F AND B!=D AND F!=H AND E!=I) OR (F==H AND F!=B AND H!=D AND E!=C) => 6=F
      const p6 =
        (eql(s, b, f) && !eql(s, b, d) && !eql(s, f, h) && !eql(s, e, i)) ||
        (eql(s, f, h) && !eql(s, f, b) && !eql(s, h, d) && !eql(s, e, c))
          ? f
          : e;

      // IF H==D AND H!=F AND D!=B => 7=D
      const p7 = eql(s, h, d) && !eql(s, h, f) && !eql(s, d, b) ? d : e;

      // IF (F==H AND F!=B AND H!=D AND E!=G) OR (H==D AND H!=F AND D!=B AND E!=I) => 8=H
      const p8 =
        (eql(s, f, h) && !eql(s, f, b) && !eql(s, h, d) && !eql(s, e, g)) ||
        (eql(s, h, d) && !eql(s, h, f) && !eql(s, d, b) && !eql(s, e, i))
          ? h
          : e;

      // IF F==H AND F!=B AND H!=D => 9=F
      const p9 = eql(s, f, h) && !eql(s, f, b) && !eql(s, h, d) ? f : e;

      const oOffset = ix * 3 * 4 + iy * 3 * oStride;

      output.data.set(s.subarray(p1, p1 + 4), oOffset);
      output.data.set(s.subarray(p2, p2 + 4), oOffset + 4);
      output.data.set(s.subarray(p3, p3 + 4), oOffset + 8);
      output.data.set(s.subarray(p4, p4 + 4), oOffset + oStride);
      output.data.set(s.subarray(p5, p5 + 4), oOffset + oStride + 4);
      output.data.set(s.subarray(p6, p6 + 4), oOffset + oStride + 8);
      output.data.set(s.subarray(p7, p7 + 4), oOffset + oStride * 2);
      output.data.set(s.subarray(p8, p8 + 4), oOffset + oStride * 2 + 4);
      output.data.set(s.subarray(p9, p9 + 4), oOffset + oStride * 2 + 8);
    }

  return output;
};
