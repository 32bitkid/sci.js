export interface ToUint32Options {
  /**
   * Specify what byte-ordering is used.
   * @default `'little-endian'`
   */
  byteOrder?: 'little-endian' | 'big-endian';
}

/**
 * @interface
 */
export type FromUint32Options = ToUint32Options & {
  /**
   * If **false**, ignore the alpha component.
   * @default `true`
   */
  alpha?: boolean;
};
