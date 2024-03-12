import { BitReader } from '@4bitlabs/readers';
import { ExtendedOpCode, isExtendedOpCode, OpCode } from './op-codes';
import { PicState } from './pic-state';
import { getPoint16, getPoint24, getPoint8 } from './points';
import { DrawCommand, DrawMode } from '../../models/draw-command';
import { Vec2, vec2 } from '../../models/vec2';
import { repeat } from '../../utils/repeat';
import { parseCel } from '../cel';

export const IS_DONE = Symbol('done');

type CodeHandler = (
  br: BitReader,
  state: PicState,
) => DrawCommand[] | typeof IS_DONE | void;

export const CodeHandlers: Record<OpCode, CodeHandler> = {
  [OpCode.SetVisual](br, state) {
    const [, priorityCode, controlCode] = state.drawCodes;
    const visualCode = br.read32(8);
    state.drawCodes = [visualCode, priorityCode, controlCode];
    state.drawMode |= DrawMode.Visual;
  },
  [OpCode.ClearVisual](br, state) {
    state.drawMode &= ~DrawMode.Visual;
  },

  [OpCode.SetPriority](br, state) {
    const [visualCode, , controlCode] = state.drawCodes;
    const priorityCode = br.read32(8);
    state.drawCodes = [visualCode, priorityCode, controlCode];
    state.drawMode |= DrawMode.Priority;
  },
  [OpCode.ClearPriority](br, state) {
    state.drawMode &= ~DrawMode.Priority;
  },

  [OpCode.SetControl](br, state) {
    const [visualCode, priorityCode] = state.drawCodes;
    const controlCode = br.read32(8);
    state.drawCodes = [visualCode, priorityCode, controlCode];
    state.drawMode |= DrawMode.Control;
  },
  [OpCode.ClearControl](br, state) {
    state.drawMode &= ~DrawMode.Control;
  },

  [OpCode.ShortLines](br, { drawMode, drawCodes }) {
    const points: Vec2[] = [];
    const prev = getPoint24(br, vec2.create());
    points.push(vec2.clone(prev));
    while (br.peek32(8) < 0xf0) {
      const next = getPoint8(br, vec2.create(), prev);
      points.push(next);
      vec2.copy(prev, next);
    }
    return [['PLINE', drawMode, drawCodes, ...points]];
  },
  [OpCode.MediumLines](br, { drawMode, drawCodes }) {
    const points: Vec2[] = [];
    const prev = getPoint24(br, vec2.create());
    points.push(vec2.clone(prev));
    while (br.peek32(8) < 0xf0) {
      const next = getPoint16(br, vec2.create(), prev);
      points.push(next);
      vec2.copy(prev, next);
    }
    return [['PLINE', drawMode, drawCodes, ...points]];
  },
  [OpCode.LongLines](br, { drawMode, drawCodes }) {
    const points: Vec2[] = [];
    points.push(getPoint24(br, vec2.create()));
    while (br.peek32(8) < 0xf0) {
      points.push(getPoint24(br, vec2.create()));
    }
    return [['PLINE', drawMode, drawCodes, ...points]];
  },
  // Patterns
  [OpCode.SetPattern](br, state) {
    const code = br.read32(8);
    state.patternCode = [
      code & 0b00111,
      (code & 0b010000) !== 0,
      (code & 0b100000) !== 0,
    ];
  },
  [OpCode.ShortBrushes](br, { drawMode, drawCodes, patternCode }) {
    const cmds: DrawCommand[] = [];
    const prev = vec2.create();
    const [, , isTextured] = patternCode;

    let texture: number = isTextured ? br.read32(8) >> 1 : 0;
    getPoint24(br, prev);
    cmds.push([
      'BRUSH',
      drawMode,
      drawCodes,
      patternCode,
      texture,
      vec2.clone(prev),
    ]);

    while (br.peek32(8) < 0xf0) {
      texture = isTextured ? br.read32(8) >> 1 : 0;
      const next = getPoint8(br, vec2.create(), prev);
      cmds.push(['BRUSH', drawMode, drawCodes, patternCode, texture, next]);
      vec2.copy(prev, next);
    }
    return cmds;
  },
  [OpCode.MediumBrushes](br, { drawMode, drawCodes, patternCode }) {
    const cmds: DrawCommand[] = [];
    const prev = vec2.create();
    const [, , isTextured] = patternCode;

    let texture: number = isTextured ? br.read32(8) >> 1 : 0;
    getPoint24(br, prev);
    cmds.push([
      'BRUSH',
      drawMode,
      drawCodes,
      patternCode,
      texture,
      vec2.clone(prev),
    ]);

    while (br.peek32(8) < 0xf0) {
      texture = isTextured ? br.read32(8) >> 1 : 0;
      const next = getPoint16(br, vec2.create(), prev);
      cmds.push(['BRUSH', drawMode, drawCodes, patternCode, texture, next]);
      vec2.copy(prev, next);
    }
    return cmds;
  },
  [OpCode.LongBrushes](br, { drawMode, drawCodes, patternCode }) {
    const cmds: DrawCommand[] = [];
    const [, , isTextured] = patternCode;

    while (br.peek32(8) < 0xf0) {
      const texture = isTextured ? br.read32(8) >> 1 : 0;
      const pos = getPoint24(br, vec2.create());
      cmds.push(['BRUSH', drawMode, drawCodes, patternCode, texture, pos]);
    }
    return cmds;
  },

  // Fills
  [OpCode.Fills](br, { drawMode, drawCodes }) {
    const fills: DrawCommand[] = [];
    const p1 = vec2.create();
    while (true) {
      const peek = br.peek32(8);
      if (peek >= 0xf0) break;
      getPoint24(br, p1);
      fills.push(['FILL', drawMode, drawCodes, vec2.clone(p1)]);
    }
    return fills;
  },

  [OpCode.XOp](br, state) {
    const opx = br.read32(8);
    if (!isExtendedOpCode(opx))
      throw new Error(`Unrecognized xopcode: 0x${opx.toString(16)}`);
    return ExtendedHandlers[opx](br, state);
  },
  [OpCode.Done]: () => IS_DONE,
};

const ExtendedHandlers: Record<ExtendedOpCode, CodeHandler> = {
  [ExtendedOpCode.UpdatePalette](br) {
    const entries: [number, number, number][] = [];
    while (br.peek32(8) < 0xf0) {
      const entry = br.read32(8);
      const pal = (entry / 40) >>> 0;
      const idx = entry % 40;

      const code = br.read32(8);
      entries.push([pal, idx, code]);
    }

    return [['UPDATE_PALETTE', entries]];
  },
  [ExtendedOpCode.SetPalette](br) {
    const pal = br.read32(8);
    const colors = new Uint8Array(40);
    repeat(40, (i) => (colors[i] = br.read32(8)));
    return [['SET_PALETTE', pal, colors]];
  },
  [ExtendedOpCode.x02](br) {
    // Looks like a palette, but i'm not sure what this chunk is for
    br.skip(8);
    br.skip(8 * 40);
  },
  [ExtendedOpCode.x03](br) {
    // Not sure what byte this is for
    br.skip(8);
  },
  [ExtendedOpCode.x04]() {
    // Not sure what this code means
    // NOOP
  },
  [ExtendedOpCode.x05](br) {
    // Not sure what byte this is for
    br.skip(8);
  },
  [ExtendedOpCode.x06]() {
    // Not sure what this code means
    // NOOP
  },
  [ExtendedOpCode.x07](br, state) {
    const pos = getPoint24(br, vec2.create());
    const size = br.read32(8) | (br.read32(8) << 8);

    const buffer = new ArrayBuffer(size);

    const view = new DataView(buffer);
    repeat(size, (i) => view.setUint8(i, br.read32(8)));
    const cel = parseCel(view);

    return [['CEL', state.drawMode, pos, cel]];
  },
  [ExtendedOpCode.x08](br) {
    repeat(14, () => br.read32(8));
  },
};
