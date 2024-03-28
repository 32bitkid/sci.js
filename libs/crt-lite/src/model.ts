// prettier-ignore
export const VERTEX = Float32Array.of(
  -1.0, -1.0, 0.0,
   1.0, -1.0, 0.0,
   1.0,  1.0, 0.0,
  -1.0,  1.0, 0.0,
);

// prettier-ignore
export const INDICES = Uint8Array.of(
  0, 1, 2,
  0, 2, 3,
  2, 1, 0,
  3, 2, 0
);

// prettier-ignore
export const TEXTURE_COORDS = Float32Array.of(
  0.0, 1.0,
  1.0, 1.0,
  1.0, 0.0,
  0.0, 0.0,
);
