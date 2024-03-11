export const epx9 = (
  src: Uint32Array,
  s9: [number, number, number, number, number, number, number, number, number],
  p9: Uint32Array = new Uint32Array(9),
): Uint32Array => {
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
