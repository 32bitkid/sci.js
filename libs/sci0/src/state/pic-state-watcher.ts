import type {
  DrawCommand,
  PicCommand,
  PicStateCommand,
} from '../models/pic-command.js';
import { DEFAULT_MONO, DEFAULT_PALETTE } from './default-palette.js';
import type { PicState } from './pic-state.js';
import { DrawMode } from '../models/draw-mode.js';

export interface PicStateWatcher {
  readonly state: Readonly<PicState>;
  observeAll: (source: Iterable<PicCommand>) => Generator<PicCommand>;
  observeDraws: (source: Iterable<PicCommand>) => Generator<DrawCommand>;
}

export function picStateWatcher(): PicStateWatcher {
  const state: PicState = {
    drawMode: DrawMode.Visual | DrawMode.Priority | DrawMode.Mono,
    drawCodes: [0, 0, 0, 0],
    patternCode: [0, false, false],
    palette: Uint8Array.from(DEFAULT_PALETTE),
    monoPalette: Uint8Array.from(DEFAULT_MONO),
  };

  const tick = (cmd: PicCommand): cmd is PicStateCommand => {
    const [mode] = cmd;
    switch (mode) {
      case 'SET_VISUAL': {
        const [, code] = cmd;
        state.drawMode |= DrawMode.Visual | DrawMode.Mono;
        const [, priorityCode, controlCode] = state.drawCodes;
        state.drawCodes = [code, priorityCode, controlCode, code];
        return true;
      }
      case 'CLEAR_VISUAL': {
        state.drawMode &=
          ~DrawMode.Visual & ~DrawMode.Mono & ~DrawMode.MonoDirect;
        return true;
      }
      case 'SET_PRIORITY': {
        const [, priorityCode] = cmd;
        state.drawMode |= DrawMode.Priority;
        const [visualCode, , controlCode, monoCode] = state.drawCodes;
        state.drawCodes = [visualCode, priorityCode, controlCode, monoCode];
        return true;
      }
      case 'CLEAR_PRIORITY': {
        state.drawMode &= ~DrawMode.Priority;
        return true;
      }
      case 'SET_CONTROL': {
        const [, controlCode] = cmd;
        state.drawMode |= DrawMode.Control;
        const [visualCode, priorityCode, , monoCode] = state.drawCodes;
        state.drawCodes = [visualCode, priorityCode, controlCode, monoCode];
        return true;
      }
      case 'CLEAR_CONTROL': {
        state.drawMode &= ~DrawMode.Control;
        return true;
      }
      case 'SET_PATTERN': {
        const [, size, rect, spray] = cmd;
        state.patternCode = [size, rect, spray];
        return true;
      }
      case 'SET_MONO': {
        state.drawMode |= DrawMode.Mono;
        state.drawMode &= ~DrawMode.MonoDirect;
        const [, code] = cmd;
        const [visualCode, priorityCode, controlCode] = state.drawCodes;
        state.drawCodes = [visualCode, priorityCode, controlCode, code];
        return true;
      }
      case 'SET_MONO_DIRECT': {
        state.drawMode |= DrawMode.MonoDirect;
        state.drawMode &= ~DrawMode.Mono;
        const [, code] = cmd;
        const [visualCode, priorityCode, controlCode] = state.drawCodes;
        state.drawCodes = [visualCode, priorityCode, controlCode, code];
        return true;
      }
      case 'CLEAR_MONO':
      case 'CLEAR_MONO_DIRECT': {
        state.drawMode &= ~DrawMode.Mono & ~DrawMode.MonoDirect;
        return true;
      }
      case 'SET_PALETTE': {
        const [, pal, ...codes] = cmd;
        state.palette.set(codes.slice(0, 40), pal * 40);
        return true;
      }
      case 'UPDATE_PALETTE': {
        const [, ...entries] = cmd;
        for (const [pal, idx, code] of entries)
          state.palette[pal * 40 + idx] = code;
        return true;
      }
      case 'SET_MONO_PALETTE': {
        const [, pal, ...codes] = cmd;
        state.monoPalette.set(codes.slice(0, 40), pal * 40);
        return true;
      }
      case 'SET_PRIORITY_BANDS': {
        /** TODO implement priority bands (SCI01?) */
        return true;
      }
    }

    return false;
  };

  return {
    get state() {
      return state;
    },
    observeAll: function* (
      source: Iterable<PicCommand>,
    ): Generator<PicCommand> {
      for (const cmd of source) {
        tick(cmd);
        yield cmd;
      }
    },
    observeDraws: function* (
      source: Iterable<PicCommand>,
    ): Generator<DrawCommand> {
      for (const cmd of source) {
        if (!tick(cmd)) yield cmd;
      }
    },
  };
}
