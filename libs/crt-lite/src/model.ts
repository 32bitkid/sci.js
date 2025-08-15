// biome-ignore format: readability
export const VERTEX: Float32Array = Float32Array.of(
  -1.0, -1.0, 0.0,
   1.0, -1.0, 0.0,
   1.0,  1.0, 0.0,
  -1.0,  1.0, 0.0,
);

// biome-ignore format: readability
export const INDICES: Uint8Array = Uint8Array.of(
  0, 1, 2,
  0, 2, 3,
  2, 1, 0,
  3, 2, 0
);

// biome-ignore format: readability
export const TEXTURE_COORDS: Float32Array = Float32Array.of(
  0.0, 1.0,
  1.0, 1.0,
  1.0, 0.0,
  0.0, 0.0,
);
