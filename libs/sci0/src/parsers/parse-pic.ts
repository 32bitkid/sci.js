import { createBitReader } from '@4bitlabs/readers';
import { CodeHandlers } from './pic/handlers';
import { OpCode, isOpCode } from './pic/op-codes';
import { createPicState } from './pic/pic-state';
import type { DrawCommand } from '../models/draw-command';
import type { Pic } from '../models/pic';

function* picIterable(source: Uint8Array): IterableIterator<DrawCommand> {
  process.stderr.write('parsing\n');
  const r = createBitReader(source, { mode: 'msb' });
  const state = createPicState();
  while (true) {
    const op = r.read32(8);

    if (!isOpCode(op))
      throw new Error(`Unrecognized opcode: 0x${op.toString(16)}`);

    if (op === OpCode.Done) break;

    const handler = CodeHandlers[op];
    if (!handler) throw new Error(`Unhandled opcode: 0x${op.toString(16)}`);

    yield* handler(r, state);
  }
}

/**
 * Parse a {@link Pic} resource from bytes.
 *
 * @param source
 * @returns Parsed draw commands as an array.
 */
export function parsePic(source: Uint8Array): DrawCommand[];
/**
 * Parse a {@link Pic} resource from bytes.
 *
 * @param source
 * @param options
 * @param options.defer Return an {@link !Iterable} of {@link DrawCommand} that will parse source on demand.
 */
export function parsePic(source: Uint8Array, options: { defer: true }): Pic;
export function parsePic(
  source: Uint8Array,
  options: { defer?: boolean } = {},
): Pic {
  const { defer } = options;
  return defer
    ? {
        [Symbol.iterator](): Iterator<DrawCommand, void, undefined> {
          return picIterable(source);
        },
      }
    : [...picIterable(source)];
}
