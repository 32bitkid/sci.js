export const MAX_FILL = 320;
export const FILL_CHUNK = new Uint8ClampedArray(256 * MAX_FILL);
for (let i = 0; i < MAX_FILL * 256; i++) {
  FILL_CHUNK[i] = (i / MAX_FILL) >>> 0;
}
