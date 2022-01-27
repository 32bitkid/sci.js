import { BitReader } from '@4bitlabs/readers';
import { CodeHandlers, IS_DONE } from './handlers';
import { createPicState } from './pic-state';
import { DrawCommand } from './draw-command';
import { isOpCode } from './op-codes';

export const parseFrom = (data: Uint8Array): DrawCommand[] => {
  const commands: DrawCommand[] = [];

  const br = new BitReader(data);
  const state = createPicState(data);

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
