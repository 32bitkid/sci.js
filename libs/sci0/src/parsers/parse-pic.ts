import { createBitReader } from '@4bitlabs/readers';
import { CodeHandlers, CodeHandlerContext } from './pic/handlers';
import { OpCode, isOpCode } from './pic/op-codes';
import { createPicState } from './pic/pic-state';
import { DrawCommand } from '../models/draw-command';

export const parsePic = (source: Uint8Array): DrawCommand[] => {
  const commands: DrawCommand[] = [];
  const ctx: CodeHandlerContext = {
    r: createBitReader(source, { mode: 'msb' }),
    state: createPicState(),
    push(...next: DrawCommand[]) {
      commands.push(...next);
    },
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

  return commands;
};
