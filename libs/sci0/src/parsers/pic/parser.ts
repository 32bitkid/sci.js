import { createBitReader } from '@4bitlabs/readers';
import { CodeHandlers, IS_DONE } from './handlers';
import { isOpCode } from './op-codes';
import { createPicState } from './pic-state';
import { DrawCommand } from '../../models/draw-command';

export const parseFrom = (data: Uint8Array): DrawCommand[] => {
  const commands: DrawCommand[] = [];

  const br = createBitReader(data, { mode: 'msb' });
  const state = createPicState();

  while (true) {
    const op = br.read32(8);

    if (!isOpCode(op))
      throw new Error(`Unrecognized opcode: 0x${op.toString(16)}`);

    const handler = CodeHandlers[op];
    if (!handler) throw new Error(`Unhandled opcode: 0x${op.toString(16)}`);

    const next = handler(br, state);
    if (next === IS_DONE) break;
    if (next) commands.push(...next);
  }

  return commands;
};
