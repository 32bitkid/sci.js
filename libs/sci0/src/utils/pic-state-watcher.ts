import { DrawMode } from '../models/draw-mode.js';
import type { DrawCodes } from '../models/draw-codes.js';
import type { PatternCode } from '../models/pattern-code.js';
import type { DrawCommand } from '../models/draw-command.js';

export interface PicState {
  drawMode: DrawMode;
  drawCodes: DrawCodes;
  monoMode: DrawMode;
  monoCodes: DrawCodes;
  patternCode: PatternCode;
}

export function picStateWatcher(): {
  readonly state: Readonly<PicState>;
  observe: (source: Iterable<DrawCommand>) => Generator<DrawCommand>;
} {
  const state: PicState = {
    drawMode: DrawMode.Visual | DrawMode.Priority,
    drawCodes: [0, 0, 0],
    monoMode: DrawMode.Visual | DrawMode.Priority,
    monoCodes: [0, 0, 0],
    patternCode: [0, false, false],
  };

  return {
    get state() {
      return state;
    },
    observe: function* (source: Iterable<DrawCommand>): Generator<DrawCommand> {
      for (const cmd of source) {
        yield cmd;

        const [mode] = cmd;
        switch (mode) {
          case 'SET_VISUAL': {
            const [, visualCode] = cmd;
            state.drawMode |= DrawMode.Visual;
            const [, priorityCode, controlCode] = state.drawCodes;
            state.drawCodes = [visualCode, priorityCode, controlCode];
            break;
          }
          case 'CLEAR_VISUAL': {
            state.drawMode &= ~DrawMode.Visual;
            break;
          }
          case 'SET_PRIORITY': {
            const [, priorityCode] = cmd;
            state.drawMode |= DrawMode.Priority;
            const [visualCode, , controlCode] = state.drawCodes;
            state.drawCodes = [visualCode, priorityCode, controlCode];
            break;
          }
          case 'CLEAR_PRIORITY': {
            state.drawMode &= ~DrawMode.Priority;
            break;
          }
          case 'SET_CONTROL': {
            const [, controlCode] = cmd;
            state.drawMode |= DrawMode.Control;
            const [visualCode, priorityCode] = state.drawCodes;
            state.drawCodes = [visualCode, priorityCode, controlCode];
            break;
          }
          case 'CLEAR_CONTROL': {
            state.drawMode &= ~DrawMode.Control;
            break;
          }
          case 'SET_PATTERN': {
            const [, size, rect, spray] = cmd;
            state.patternCode = [size, rect, spray];
          }
        }
      }
    },
  };
}
