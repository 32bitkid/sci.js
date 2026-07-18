import type { DrawCommand } from './draw-command.js';

/**
 * A `PIC` resource.
 *
 * @see {@link parsePic}
 */
export interface Pic {
  [Symbol.iterator](): Iterator<DrawCommand, void, undefined>;
}
