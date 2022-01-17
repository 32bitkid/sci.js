export const s9 = (
  src: Uint32Array,
  width: number,
  height: number,
  ix: number,
  iy: number,
  p9: number[] = Array(9),
): number[] => {
  const e = iy * width + ix;

  const [uOk, rOk, lOk, dOk] = [
    iy - 1 >= 0,
    ix + 1 < width,
    ix - 1 >= 0,
    iy + 1 < height,
  ];

  p9[4] = e;

  p9[1] = uOk ? (iy - 1) * width + ix : e;
  p9[3] = lOk ? iy * width + (ix - 1) : e;
  p9[5] = rOk ? iy * width + (ix + 1) : e;
  p9[7] = dOk ? (iy + 1) * width + ix : e;

  p9[0] = uOk && lOk ? (iy - 1) * width + (ix - 1) : e;
  p9[2] = uOk && rOk ? (iy - 1) * width + (ix + 1) : e;
  p9[6] = dOk && lOk ? (iy + 1) * width + (ix - 1) : e;
  p9[8] = dOk && rOk ? (iy + 1) * width + (ix + 1) : e;

  return p9;
};

export const epx9 = (
  src: Uint32Array,
  s9: number[],
  p9: number[] = Array(9),
): number[] => {
  const [a, b, c, d, e, f, g, h, i] = s9;

  // IF D==B AND D!=H AND B!=F => 1=D
  p9[0] =
    src[d] === src[b] && !(src[d] === src[h]) && !(src[b] === src[f]) ? d : e;

  // IF (D==B AND D!=H AND B!=F AND E!=C) OR (B==F AND B!=D AND F!=H AND E!=A) => 2=B
  p9[1] =
    (src[d] === src[b] &&
      !(src[d] === src[h]) &&
      !(src[b] === src[f]) &&
      !(src[e] === src[c])) ||
    (src[b] === src[f] &&
      !(src[b] === src[d]) &&
      !(src[f] === src[h]) &&
      !(src[e] === src[a]))
      ? b
      : e;

  // IF B==F AND B!=D AND F!=H => 3=F
  p9[2] =
    src[b] === src[f] && !(src[b] === src[d]) && !(src[f] === src[h]) ? f : e;

  // IF (H==D AND H!=F AND D!=B AND E!=A) OR (D==B AND D!=H AND B!=F AND E!=G) => 4=D
  p9[3] =
    (src[h] === src[d] &&
      !(src[h] === src[f]) &&
      !(src[d] === src[b]) &&
      !(src[e] === src[a])) ||
    (src[d] === src[b] &&
      !(src[d] === src[h]) &&
      !(src[b] === src[f]) &&
      !(src[e] === src[g]))
      ? d
      : e;

  // 5=E
  p9[4] = e;

  // IF (B==F AND B!=D AND F!=H AND E!=I) OR (F==H AND F!=B AND H!=D AND E!=C) => 6=F
  p9[5] =
    (src[b] === src[f] &&
      !(src[b] === src[d]) &&
      !(src[f] === src[h]) &&
      !(src[e] === src[i])) ||
    (src[f] === src[h] &&
      !(src[f] === src[b]) &&
      !(src[h] === src[d]) &&
      !(src[e] === src[c]))
      ? f
      : e;

  // IF H==D AND H!=F AND D!=B => 7=D
  p9[6] =
    src[h] === src[d] && !(src[h] === src[f]) && !(src[d] === src[b]) ? d : e;

  // IF (F==H AND F!=B AND H!=D AND E!=G) OR (H==D AND H!=F AND D!=B AND E!=I) => 8=H
  p9[7] =
    (src[f] === src[h] &&
      !(src[f] === src[b]) &&
      !(src[h] === src[d]) &&
      !(src[e] === src[g])) ||
    (src[h] === src[d] &&
      !(src[h] === src[f]) &&
      !(src[d] === src[b]) &&
      !(src[e] === src[i]))
      ? h
      : e;

  // IF F==H AND F!=B AND H!=D => 9=F
  p9[8] =
    src[f] === src[h] && !(src[f] === src[b]) && !(src[h] === src[d]) ? f : e;

  return p9;
};
