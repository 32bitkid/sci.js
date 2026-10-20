import { DrawMode } from '../models/draw-mode.js';
import type { DrawCodes } from '../models/draw-codes.js';
import { OpCode } from '../parsers/pic/op-codes.js';

type DrawState = { mode: DrawMode; codes: DrawCodes };

const isVisualChanged = (prev: DrawState, next: DrawState): boolean =>
  DrawMode.isVisualMode(next.mode) !== DrawMode.isVisualMode(prev.mode) ||
  next.codes[0] !== prev.codes[0];

const isPriorityChanged = (prev: DrawState, next: DrawState): boolean =>
  DrawMode.isPriorityMode(next.mode) !== DrawMode.isPriorityMode(prev.mode) ||
  next.codes[1] !== prev.codes[1];

const isControlChanged = (prev: DrawState, next: DrawState): boolean =>
  DrawMode.isControlMode(next.mode) !== DrawMode.isControlMode(prev.mode) ||
  next.codes[2] !== prev.codes[2];

export const createState = (
  { mode, codes }: DrawState = {
    mode: DrawMode.Visual | DrawMode.Priority,
    codes: [0, 0, 0],
  },
) => {
  const state: DrawState = { mode, codes: [...codes] };
  return function* (next: DrawState): Generator<Uint8Array, void, unknown> {
    if (isVisualChanged(state, next)) {
      yield DrawMode.isVisualMode(next.mode)
        ? Uint8Array.of(OpCode.SetVisual, next.codes[0])
        : Uint8Array.of(OpCode.ClearVisual);
    }

    if (isPriorityChanged(state, next)) {
      yield DrawMode.isPriorityMode(next.mode)
        ? Uint8Array.of(OpCode.SetPriority, next.codes[1])
        : Uint8Array.of(OpCode.ClearPriority);
    }

    if (isControlChanged(state, next)) {
      yield DrawMode.isControlMode(next.mode)
        ? Uint8Array.of(OpCode.SetControl, next.codes[0])
        : Uint8Array.of(OpCode.ClearControl);
    }

    state.mode = next.mode;
    state.codes = next.codes;
  };
};
