export const s9 = (
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
  // prettier-ignore
  const [
    A, B, C,
    D, E, F,
    G, H, I,
  ] = [
    src[s9[0]], src[s9[1]], src[s9[2]],
    src[s9[3]], src[s9[4]], src[s9[5]],
    src[s9[6]], src[s9[7]], src[s9[8]],
  ];

  if (B !== H && D !== F) {
    p9[0] = D === B ? D : E;
    p9[1] = (D === B && E !== C) || (B === F && E !== A) ? B : E;
    p9[2] = B === F ? F : E;
    p9[3] = (D === B && E !== G) || (D === H && E !== A) ? D : E;
    p9[4] = E;
    p9[5] = (B === F && E !== I) || (H === F && E !== C) ? F : E;
    p9[6] = D === H ? D : E;
    p9[7] = (D === H && E !== I) || (H === F && E !== G) ? H : E;
    p9[8] = H === F ? F : E;
  } else {
    p9[0] = E;
    p9[1] = E;
    p9[2] = E;
    p9[3] = E;
    p9[4] = E;
    p9[5] = E;
    p9[6] = E;
    p9[7] = E;
    p9[8] = E;
  }

  return p9;
};
