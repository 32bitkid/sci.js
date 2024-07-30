/**
 * Common pre-defined palettes for working with CGA/EGA graphics.
 */
export * as Palettes from './palettes';

/**
 * Color mixing utilities.
 */
export * as Mixers from './mixers';

/**
 * Pre-defined Dither Pairs and dithering functions
 *
 * | NAME | Palette | Mix |
 * | --- | --- | --- |
 * | {@link Dithers.CGA} | {@link Palettes.CGA_PALETTE } | _none_ |
 * | {@link Dithers.CGA_MIX} | {@link Palettes.CGA_PALETTE } | {@link Mixers.mixBy | 25% mix } |
 * | {@link Dithers.CGA_FLAT} | {@link Palettes.CGA_PALETTE } | {@link Mixers.mixBy | 50% mix } |
 * | {@link Dithers.CGA_SOFT} | {@link Palettes.CGA_PALETTE } | {@link Mixers.softMixer | soft } |
 * | {@link Dithers.TRUE_CGA} | {@link Palettes.TRUE_CGA_PALETTE } | _none_ |
 * | {@link Dithers.TRUE_CGA_MIX} | {@link Palettes.TRUE_CGA_PALETTE } | {@link Mixers.mixBy | 25% mix } |
 * | {@link Dithers.TRUE_CGA_FLAT} | {@link Palettes.TRUE_CGA_PALETTE } | {@link Mixers.mixBy | 50% mix } |
 * | {@link Dithers.TRUE_CGA_SOFT} | {@link Palettes.TRUE_CGA_PALETTE } | {@link Mixers.softMixer | soft } |
 */
export * as Dithers from './dithers';

export { toGrayscale } from './to-grayscale';
export { IBM5153Contrast } from './IBM-5153-contrast';
