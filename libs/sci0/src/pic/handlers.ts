import { vec2 } from 'gl-matrix';
import { BitReader } from '@4bitlabs/readers';

import { ExtendedOpCode, isExtendedOpCode, OpCode } from './op-codes';
import { repeat } from '../repeat';
import { getPoint16, getPoint24, getPoint8 } from './points';
import { DrawCommand } from './draw-command';
import { DrawMode, PicState } from './pic-state';

export const IS_DONE = Symbol('done');

type CodeHandler = (
  br: BitReader,
  state: PicState,
) => DrawCommand[] | typeof IS_DONE | void;

const ExtendedHandlers: Record<ExtendedOpCode, CodeHandler> = {
  [ExtendedOpCode.UpdatePalette](br, state) {
    while (br.peek32(8) < 0xf0) {
      const code = br.read32(8);
      const color = br.read32(8);

      const pal = (code / 40) >>> 0;
      const idx = code % 40;

      state.palettes[pal][idx] = color;
    }
  },
  [ExtendedOpCode.SetPalette](br, state) {
    const idx = br.read32(8);
    const palette = new Uint8Array(40);
    repeat(40, (i) => (palette[i] = br.read32(8)));
    state.palettes[idx] = palette;
    return [['SET_PALETTE', idx, palette]];
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
  [ExtendedOpCode.x07]() {
    throw new Error(`Unimplemented extended handler: 0x07`);
  },
  [ExtendedOpCode.x08]() {
    throw new Error(`Unimplemented extended handler: 0x08`);
  },
};

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
    const points: vec2[] = [];
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
    const points: vec2[] = [];
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
    const points: vec2[] = [];
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
      (code & 0b10000) !== 0,
      (code & 0b100000) !== 0,
    ];
  },
  [OpCode.ShortBrushes](br, { drawMode, drawCodes, patternCode }) {
    const cmds: DrawCommand[] = [];
    const pos = vec2.create();
    const [, , isTextured] = patternCode;

    let texture: number = isTextured ? br.read32(8) >> 1 : 0;
    getPoint24(br, pos);
    cmds.push([
      'BRUSH',
      drawMode,
      drawCodes,
      patternCode,
      texture,
      vec2.clone(pos),
    ]);

    while (br.peek32(8) < 0xf0) {
      texture = isTextured ? br.read32(8) >> 1 : 0;
      getPoint8(br, pos, pos);
      cmds.push([
        'BRUSH',
        drawMode,
        drawCodes,
        patternCode,
        texture,
        vec2.clone(pos),
      ]);
    }
    return cmds;
  },
  [OpCode.MediumBrushes](br, { drawMode, drawCodes, patternCode }) {
    const cmds: DrawCommand[] = [];
    const pos = vec2.create();
    const [, , isTextured] = patternCode;

    let texture: number = isTextured ? br.read32(8) >> 1 : 0;
    getPoint24(br, pos);
    cmds.push([
      'BRUSH',
      drawMode,
      drawCodes,
      patternCode,
      texture,
      vec2.clone(pos),
    ]);

    while (br.peek32(8) < 0xf0) {
      texture = isTextured ? br.read32(8) >> 1 : 0;
      getPoint16(br, pos, pos);
      cmds.push([
        'BRUSH',
        drawMode,
        drawCodes,
        patternCode,
        texture,
        vec2.clone(pos),
      ]);
    }
    return cmds;
  },
  [OpCode.LongBrushes](br, { drawMode, drawCodes, patternCode }) {
    const cmds: DrawCommand[] = [];
    const pos = vec2.create();
    const [, , isTextured] = patternCode;

    while (br.peek32(8) < 0xf0) {
      const texture = isTextured ? br.read32(8) >> 1 : 0;
      getPoint24(br, pos);
      cmds.push([
        'BRUSH',
        drawMode,
        drawCodes,
        patternCode,
        texture,
        vec2.clone(pos),
      ]);
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
