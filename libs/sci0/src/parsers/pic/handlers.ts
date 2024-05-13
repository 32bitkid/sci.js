import { BitReader } from '@4bitlabs/readers';
import { ExtendedOpCode, isExtendedOpCode, OpCode } from './op-codes';
import { PicState } from './pic-state';
import { getPoint16, getPoint24, getPoint8 } from './points';
import { DrawCommand, DrawMode } from '../../models/draw-command';
import { Vec2, vec2 } from '../../models/vec2';
import { repeat } from '../../utils/repeat';
import { parseCel } from '../cel';

export interface CodeHandlerContext {
  r: BitReader;
  state: PicState;
  cmds: DrawCommand[];
}

type CodeHandler = (ctx: CodeHandlerContext) => void;

export const CodeHandlers: Record<Exclude<OpCode, OpCode.Done>, CodeHandler> = {
  [OpCode.SetVisual]({ r, state }) {
    const [, priorityCode, controlCode] = state.drawCodes;
    const visualCode = r.read32(8);
    state.drawCodes = [visualCode, priorityCode, controlCode];
    state.drawMode |= DrawMode.Visual;
  },
  [OpCode.ClearVisual]({ state }) {
    state.drawMode &= ~DrawMode.Visual;
  },

  [OpCode.SetPriority]({ r: br, state }) {
    const [visualCode, , controlCode] = state.drawCodes;
    const priorityCode = br.read32(8);
    state.drawCodes = [visualCode, priorityCode, controlCode];
    state.drawMode |= DrawMode.Priority;
  },
  [OpCode.ClearPriority]({ state }) {
    state.drawMode &= ~DrawMode.Priority;
  },

  [OpCode.SetControl]({ r, state }) {
    const [visualCode, priorityCode] = state.drawCodes;
    const controlCode = r.read32(8);
    state.drawCodes = [visualCode, priorityCode, controlCode];
    state.drawMode |= DrawMode.Control;
  },
  [OpCode.ClearControl]({ state }) {
    state.drawMode &= ~DrawMode.Control;
  },

  // Lines
  [OpCode.ShortLines]({ r, state, cmds }) {
    const points: Vec2[] = [];
    const prev = getPoint24(r, vec2.create());
    points.push(vec2.clone(prev));
    while (r.peek32(8) < 0xf0) {
      const next = getPoint8(r, vec2.create(), prev);
      points.push(next);
      vec2.copy(prev, next);
    }
    cmds.push(['PLINE', state.drawMode, state.drawCodes, ...points]);
  },
  [OpCode.MediumLines]({ r, state, cmds }) {
    const points: Vec2[] = [];
    const prev = getPoint24(r, vec2.create());
    points.push(vec2.clone(prev));
    while (r.peek32(8) < 0xf0) {
      const next = getPoint16(r, vec2.create(), prev);
      points.push(next);
      vec2.copy(prev, next);
    }
    cmds.push(['PLINE', state.drawMode, state.drawCodes, ...points]);
  },
  [OpCode.LongLines]({ r, state, cmds }) {
    const points: Vec2[] = [];
    points.push(getPoint24(r, vec2.create()));
    while (r.peek32(8) < 0xf0) {
      points.push(getPoint24(r, vec2.create()));
    }
    cmds.push(['PLINE', state.drawMode, state.drawCodes, ...points]);
  },

  // Patterns
  [OpCode.SetPattern]({ r, state }) {
    const code = r.read32(8);
    state.patternCode = [
      code & 0b00111,
      (code & 0b010000) !== 0,
      (code & 0b100000) !== 0,
    ];
  },
  [OpCode.ShortBrushes]({ r, state, cmds }) {
    const prev = vec2.create();
    const { drawMode, drawCodes, patternCode } = state;
    const [, , isTextured] = patternCode;

    let texture: number = isTextured ? r.read32(8) >> 1 : 0;
    getPoint24(r, prev);
    cmds.push([
      'BRUSH',
      drawMode,
      drawCodes,
      patternCode,
      texture,
      vec2.clone(prev),
    ]);

    while (r.peek32(8) < 0xf0) {
      texture = isTextured ? r.read32(8) >> 1 : 0;
      const next = getPoint8(r, vec2.create(), prev);
      cmds.push(['BRUSH', drawMode, drawCodes, patternCode, texture, next]);
      vec2.copy(prev, next);
    }
  },
  [OpCode.MediumBrushes]({ r, state, cmds }) {
    const prev = vec2.create();
    const { drawMode, drawCodes, patternCode } = state;
    const [, , isTextured] = patternCode;

    let texture: number = isTextured ? r.read32(8) >> 1 : 0;
    getPoint24(r, prev);
    cmds.push([
      'BRUSH',
      drawMode,
      drawCodes,
      patternCode,
      texture,
      vec2.clone(prev),
    ]);

    while (r.peek32(8) < 0xf0) {
      texture = isTextured ? r.read32(8) >> 1 : 0;
      const next = getPoint16(r, vec2.create(), prev);
      cmds.push(['BRUSH', drawMode, drawCodes, patternCode, texture, next]);
      vec2.copy(prev, next);
    }
  },
  [OpCode.LongBrushes]({ r, state, cmds }) {
    const { drawMode, drawCodes, patternCode } = state;
    const [, , isTextured] = patternCode;

    while (r.peek32(8) < 0xf0) {
      const texture = isTextured ? r.read32(8) >> 1 : 0;
      const pos = getPoint24(r, vec2.create());
      cmds.push(['BRUSH', drawMode, drawCodes, patternCode, texture, pos]);
    }
  },

  // Fills
  [OpCode.Fills]({ r, state, cmds }) {
    const { drawMode, drawCodes } = state;
    const p1 = vec2.create();
    while (true) {
      const peek = r.peek32(8);
      if (peek >= 0xf0) break;
      getPoint24(r, p1);
      cmds.push(['FILL', drawMode, drawCodes, vec2.clone(p1)]);
    }
  },

  [OpCode.XOp](ctx) {
    const opx = ctx.r.read32(8);
    if (!isExtendedOpCode(opx))
      throw new Error(`Unrecognized xopcode: 0x${opx.toString(16)}`);
    ExtendedHandlers[opx](ctx);
  },
};

const ExtendedHandlers: Record<ExtendedOpCode, CodeHandler> = {
  [ExtendedOpCode.UpdatePalette]({ r, cmds }) {
    const entries: [number, number, number][] = [];
    while (r.peek32(8) < 0xf0) {
      const entry = r.read32(8);
      const pal = (entry / 40) >>> 0;
      const idx = entry % 40;

      const code = r.read32(8);
      entries.push([pal, idx, code]);
    }

    cmds.push(['UPDATE_PALETTE', entries]);
  },
  [ExtendedOpCode.SetPalette]({ r, cmds }) {
    const pal = r.read32(8);
    const colors = new Uint8Array(40);
    repeat(40, (i) => (colors[i] = r.read32(8)));
    cmds.push(['SET_PALETTE', pal, colors]);
  },
  [ExtendedOpCode.x02]({ r }) {
    // Looks like a palette, but i'm not sure what this chunk is for
    r.skip(8);
    r.skip(8 * 40);

    // in Colonels Bequest Demo, PIC.991 this opcode appears to have a 141 byte payload.
    // Looks like another palette, but i'm not sure what this chunk is for
    // br.skip(141 * 8);
  },
  [ExtendedOpCode.x03]({ r }) {
    // Not sure what byte this is for
    r.skip(8);
  },
  [ExtendedOpCode.x04]() {
    // Not sure what this code means
    // NOOP
  },
  [ExtendedOpCode.x05]({ r }) {
    // Not sure what byte this is for
    r.skip(8);
  },
  [ExtendedOpCode.x06]() {
    // Not sure what this code means
    // NOOP
  },
  [ExtendedOpCode.x07]({ r, state, cmds }) {
    const pos = getPoint24(r, vec2.create());
    const size = r.read32(8) | (r.read32(8) << 8);

    const buffer = new ArrayBuffer(size);

    const view = new DataView(buffer);
    repeat(size, (i) => {
      view.setUint8(i, r.read32(8));
    });
    const cel = parseCel(view);

    cmds.push(['CEL', state.drawMode, pos, cel]);
  },
  [ExtendedOpCode.x08]({ r }) {
    repeat(14, () => r.read32(8));
  },
};
