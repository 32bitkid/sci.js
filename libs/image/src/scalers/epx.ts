import { S9, S13 } from './s9';

export const epx9 = (
  src: Uint32Array,
  s9: S9,
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

export const epx9sfx = (
  src: Uint32Array,
  s13: S13,
  p9: Uint32Array = new Uint32Array(9),
): Uint32Array => {
  // prettier-ignore
  const [
          J,
       A, B, C,
    K, D, E, F, L,
       G, H, I,
          M
  ] = [
    src[s13[0]], src[s13[1]], src[s13[2]],
    src[s13[3]], src[s13[4]], src[s13[5]],
    src[s13[6]], src[s13[7]], src[s13[8]],
    src[s13[9]], src[s13[10]], src[s13[11]],
    src[s13[12]],
  ];

  p9[4] = E;

  p9[0] =
    (B === D &&
      B !== F &&
      D !== H &&
      (E !== A || E === C || E === G || A === J || A === K)) ||
    (B === D && C === E && C !== J && A !== E) ||
    (B === D && E === G && A !== E && G !== K)
      ? B === D
        ? B
        : D
      : E;

  p9[2] =
    (B === F &&
      B !== D &&
      F !== H &&
      (E !== C || E === A || E === I || C === J || C === L)) ||
    (B === F && A === E && A !== J && C !== E) ||
    (B === F && E === I && C !== E && I !== L)
      ? B === F
        ? B
        : F
      : E;

  p9[6] =
    (D === H &&
      B !== D &&
      F !== H &&
      (E !== G || E === A || E === I || G === K || G === M)) ||
    (D === H && A === E && A !== K && E !== G) ||
    (D === H && E === I && E !== G && I !== M)
      ? D == H
        ? D
        : H
      : E;

  p9[8] =
    (F === H &&
      B !== F &&
      D !== H &&
      (E !== I || E === C || E === G || I === L || I === M)) ||
    (F === H && C === E && C !== L && E !== I) ||
    (F === H && E === G && E !== I && G !== M)
      ? F === H
        ? F
        : H
      : E;

  p9[1] =
    (B === D &&
      B !== F &&
      D !== H &&
      (E !== A || E === C || E === G || A === J || A === K) &&
      E !== C) ||
    (B === F &&
      B !== D &&
      F !== H &&
      (E !== C || E === A || E === I || C === J || C === L) &&
      E !== A)
      ? B
      : E;

  p9[3] =
    (B === D &&
      B !== F &&
      D !== H &&
      (E !== A || E === C || E === G || A === J || A === K) &&
      E !== G) ||
    (D === H &&
      B !== D &&
      F !== H &&
      (E !== G || E === A || E === I || G === K || G === M) &&
      E !== A)
      ? D
      : E;

  p9[5] =
    (F === H &&
      B !== F &&
      D !== H &&
      (E !== I || E === C || E === G || I === L || I === M) &&
      E !== C) ||
    (B === F &&
      B !== D &&
      F !== H &&
      (E !== C || E === A || E === I || C === J || C === L) &&
      E !== I)
      ? F
      : E;

  p9[7] =
    (F === H &&
      B !== F &&
      D !== H &&
      (E !== I || E === C || E === G || I === L || I === M) &&
      E !== G) ||
    (D === H &&
      B !== D &&
      F !== H &&
      (E !== G || E === A || E === I || G === K || G === M) &&
      E !== I)
      ? H
      : E;

  return p9;
};
