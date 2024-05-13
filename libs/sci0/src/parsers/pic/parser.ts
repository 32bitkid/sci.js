import { createBitReader } from '@4bitlabs/readers';
import { CodeHandlers, CodeHandlerContext } from './handlers';
import { OpCode, isOpCode } from './op-codes';
import { createPicState } from './pic-state';
import { DrawCommand } from '../../models/draw-command';

export const parseFrom = (data: Uint8Array): DrawCommand[] => {
  const ctx: CodeHandlerContext = {
    r: createBitReader(data, { mode: 'msb' }),
    state: createPicState(),
    cmds: [],
  };

  while (true) {
    const op = ctx.r.read32(8);

    if (!isOpCode(op))
      throw new Error(`Unrecognized opcode: 0x${op.toString(16)}`);

    if (op === OpCode.Done) break;

    const handler = CodeHandlers[op];
    if (!handler) throw new Error(`Unhandled opcode: 0x${op.toString(16)}`);

    handler(ctx);
  }

  return ctx.cmds;
};
