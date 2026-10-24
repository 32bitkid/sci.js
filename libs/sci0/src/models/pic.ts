import type { PicCommand } from './pic-command.js';

/**
 * A `PIC` resource.
 *
 * @see {@link parsePic}
 */
export interface Pic {
  [Symbol.iterator](): Iterator<PicCommand, void, undefined>;
}
