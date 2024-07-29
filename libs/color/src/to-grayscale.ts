/**
 * Convert a palette into grayscale. Uses fast luminance-approximation.
 * @param palette
 */
export const toGrayscale = (palette: Readonly<Uint32Array>): Uint32Array => {
  const grayscale = new Uint32Array(16);
  for (let i = 0; i < 16; i++) {
    const entry = palette[i];
    const R = (entry >>> 0) & 0xff;
    const G = (entry >>> 8) & 0xff;
    const B = (entry >>> 16) & 0xff;
    const a = (entry >>> 24) & 0xff;
    // Fast luminance approximation
    const l = (R + R + R + B + G + G + G + G) >>> 3;
    grayscale[i] = (a << 24) | (l << 16) | (l << 8) | l;
  }
  return grayscale;
};
