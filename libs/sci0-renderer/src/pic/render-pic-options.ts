export interface RenderPicOptions {
  /**
   * Force the selection of SCI0 palette 0&ndash;3.
   */
  forcePal?: 0 | 1 | 2 | 3 | undefined;

  /**
   * The stage width.
   * @default 320
   */
  width?: number;

  /**
   * The stage height.
   * @default 190
   */
  height?: number;
}
