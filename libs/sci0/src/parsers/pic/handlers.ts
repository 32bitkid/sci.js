import type { BitReader } from '@4bitlabs/readers';
import { type Vec2, vec2, clone, assign } from '@4bitlabs/vec2';
import { ExtendedOpCode, isExtendedOpCode, OpCode } from './op-codes.js';
import type { PicState } from '../../state/pic-state.js';
import { getPoint16, getPoint24, getPoint8 } from './points.js';
import type { PicCommand } from '../../models/pic-command.js';
import { repeat } from '../../utils/repeat.js';
import { parseCel } from '../parse-cel.js';
import type { SetPaletteCommand } from '../../models/draw-commands.js';

type CodeHandler = (
  r: BitReader,
  state: Readonly<PicState>,
) => Generator<PicCommand>;

export const CodeHandlers: Record<Exclude<OpCode, OpCode.Done>, CodeHandler> = {
  *[OpCode.SetVisual](r) {
    yield ['SET_VISUAL', r.read32(8)];
  },
  *[OpCode.ClearVisual]() {
    yield ['CLEAR_VISUAL'];
  },

  *[OpCode.SetPriority](r) {
    yield ['SET_PRIORITY', r.read32(8)];
  },
  *[OpCode.ClearPriority]() {
    yield ['CLEAR_PRIORITY'];
  },

  *[OpCode.SetControl](r) {
    yield ['SET_CONTROL', r.read32(8)];
  },
  *[OpCode.ClearControl]() {
    yield ['CLEAR_CONTROL'];
  },

  // Lines
  *[OpCode.ShortLines](r) {
    const points: Vec2[] = [];
    const prev = getPoint24(r, vec2());
    points.push(clone(prev));
    while (r.peek32(8) < 0xf0) {
      const next = getPoint8(r, vec2(), prev);
      points.push(next);
      assign(next, prev);
    }
    yield ['PLINE', ...points];
  },
  *[OpCode.MediumLines](r) {
    const points: Vec2[] = [];
    const prev = getPoint24(r, vec2());
    points.push(clone(prev));
    while (r.peek32(8) < 0xf0) {
      const next = getPoint16(r, vec2(), prev);
      points.push(next);
      assign(next, prev);
    }
    yield ['PLINE', ...points];
  },
  *[OpCode.LongLines](r) {
    const points: Vec2[] = [];
    points.push(getPoint24(r, vec2()));
    while (r.peek32(8) < 0xf0) {
      points.push(getPoint24(r, vec2()));
    }
    yield ['PLINE', ...points];
  },

  // Patterns
  *[OpCode.SetPattern](r) {
    const code = r.read32(8);
    yield [
      'SET_PATTERN',
      code & 0b0111,
      (code & 0b01_0000) !== 0,
      (code & 0b10_0000) !== 0,
      (code & 0b00_1000) !== 0,
    ];
  },
  *[OpCode.ShortBrushes](r, state) {
    const prev = vec2();
    const { patternCode } = state;
    const [, , isTextured] = patternCode;

    let texture: number = isTextured ? r.read32(8) >> 1 : 0;
    getPoint24(r, prev);
    yield ['BRUSH', texture, clone(prev)];

    while (r.peek32(8) < 0xf0) {
      texture = isTextured ? r.read32(8) >> 1 : 0;
      const next = getPoint8(r, vec2(), prev);
      yield ['BRUSH', texture, next];
      assign(next, prev);
    }
  },
  *[OpCode.MediumBrushes](r, state) {
    const prev = vec2();
    const { patternCode } = state;
    const [, , isTextured] = patternCode;

    let texture: number = isTextured ? r.read32(8) >> 1 : 0;
    getPoint24(r, prev);
    yield ['BRUSH', texture, clone(prev)];

    while (r.peek32(8) < 0xf0) {
      texture = isTextured ? r.read32(8) >> 1 : 0;
      const next = getPoint16(r, vec2(), prev);
      yield ['BRUSH', texture, next];
      assign(next, prev);
    }
  },
  *[OpCode.LongBrushes](r, state) {
    const { patternCode } = state;
    const [, , isTextured] = patternCode;

    while (r.peek32(8) < 0xf0) {
      const texture = isTextured ? r.read32(8) >> 1 : 0;
      const pos = getPoint24(r, vec2());
      yield ['BRUSH', texture, pos];
    }
  },

  // Fills
  *[OpCode.Fills](r) {
    const p1 = vec2();
    while (true) {
      const peek = r.peek32(8);
      if (peek >= 0xf0) break;
      getPoint24(r, p1);
      yield ['FILL', clone(p1)];
    }
  },

  *[OpCode.XOp](r, s) {
    const opx = r.read32(8);
    if (!isExtendedOpCode(opx))
      throw new Error(`Unrecognized xopcode: 0x${opx.toString(16)}`);
    yield* ExtendedHandlers[opx](r, s);
  },
};

const ExtendedHandlers: Record<ExtendedOpCode, CodeHandler> = {
  *[ExtendedOpCode.UpdatePalette](r) {
    const entries: [number, number, number][] = [];
    while (r.peek32(8) < 0xf0) {
      const entry = r.read32(8);
      const pal = (entry / 40) >>> 0;
      const idx = entry % 40;

      const code = r.read32(8);
      entries.push([pal, idx, code]);
    }

    yield ['UPDATE_PALETTE', ...entries];
  },
  *[ExtendedOpCode.SetPalette](r): Generator<SetPaletteCommand> {
    const pal = r.read32(8);
    const colors: number[] = Array(40).fill(0);
    repeat(40, (i) => {
      colors[i] = r.read32(8);
    });
    yield ['SET_PALETTE', pal, ...colors];
  },
  *[ExtendedOpCode.SetMonoPalette](r) {
    yield ['SET_MONO_PALETTE', r.read32(8), ...repeat(40, () => r.read32(8))];
  },
  *[ExtendedOpCode.SetMono](r) {
    yield ['SET_MONO', r.read32(8)];
  },
  *[ExtendedOpCode.ClearMono]() {
    yield ['CLEAR_MONO'];
  },
  *[ExtendedOpCode.SetMonoDirect](r) {
    yield ['SET_MONO_DIRECT', r.read32(8)];
  },
  *[ExtendedOpCode.ClearMonoDirect]() {
    yield ['CLEAR_MONO_DIRECT'];
  },
  *[ExtendedOpCode.Cel](r) {
    const pos = getPoint24(r, vec2());
    const size = r.read32(8) | (r.read32(8) << 8);

    const buffer = new ArrayBuffer(size);

    const bytes = new Uint8Array(buffer);
    repeat(size, (i) => {
      bytes[i] = r.read32(8);
    });

    const view = new DataView(buffer);
    const cel = parseCel(view);

    yield ['CEL', pos, cel];
  },
  *[ExtendedOpCode.SetPriorityBands](r) {
    yield ['SET_PRIORITY_BANDS', ...repeat(14, () => r.read32(8))];
  },
};
