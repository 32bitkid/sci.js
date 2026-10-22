import type { Pic } from '../models/pic.js';
import { exhaustive } from '../utils/exhaustive.js';
import { ExtendedOpCode, OpCode } from '../parsers/pic/op-codes.js';
import {
  plineMaxDelta,
  p16,
  p8,
  relativePoints,
  absolutePoints,
} from './point-encoders.js';
import { picStateWatcher } from '../utils/pic-state-watcher.js';

export function encodePic(pic: Pic): Uint8Array {
  const chunks: Uint8Array[] = [];
  const append = (chunk: Uint8Array) => chunks.push(chunk);
  const appendAll = (iter: Iterable<Uint8Array>) => {
    for (const chunk of iter) {
      chunks.push(chunk);
    }
  };

  const { observe } = picStateWatcher();

  for (const cmd of observe(pic)) {
    const [mode] = cmd;
    switch (mode) {
      case 'SET_VISUAL': {
        const [, code] = cmd;
        append(Uint8Array.of(OpCode.SetVisual, code));
        break;
      }
      case 'SET_PRIORITY': {
        const [, code] = cmd;
        append(Uint8Array.of(OpCode.SetPriority, code));
        break;
      }
      case 'SET_CONTROL': {
        const [, code] = cmd;
        append(Uint8Array.of(OpCode.SetControl, code));
        break;
      }
      case 'CLEAR_VISUAL': {
        append(Uint8Array.of(OpCode.ClearVisual));
        break;
      }
      case 'CLEAR_PRIORITY': {
        append(Uint8Array.of(OpCode.ClearPriority));
        break;
      }
      case 'CLEAR_CONTROL': {
        append(Uint8Array.of(OpCode.ClearControl));
        break;
      }
      case 'PLINE': {
        const [, ...points] = cmd;
        const delta = plineMaxDelta(points);
        /* TODO double check these max deltas. they need to not put 0xF in the highest nybble. */
        if (delta <= 6) {
          append(Uint8Array.of(OpCode.ShortLines));
          appendAll(relativePoints(points, p8));
        } else if (delta <= 112) {
          append(Uint8Array.of(OpCode.MediumLines));
          appendAll(relativePoints(points, p16));
        } else {
          append(Uint8Array.of(OpCode.LongLines));
          appendAll(absolutePoints(points));
        }
        break;
      }
      case 'FILL': {
        const [, ...points] = cmd;
        append(Uint8Array.of(OpCode.Fills));
        appendAll(absolutePoints(points));
        break;
      }
      case 'SET_PATTERN': {
        const [, size, rect, spray] = cmd;
        const code =
          ((spray ? 1 : 0) << 5) | ((rect ? 1 : 0) << 4) | (size & 0b111);
        append(Uint8Array.of(OpCode.SetPattern, code));
        break;
      }
      case 'BRUSH': {
        /** TODO */
        break;
      }
      case 'SET_PALETTE': {
        const [, pal, ...entries] = cmd;
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.SetPalette, pal));
        const palData = new Uint8Array(40);
        palData.set(entries);
        append(palData);
        break;
      }
      case 'UPDATE_PALETTE': {
        const [, , ...entries] = cmd;
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.UpdatePalette));
        for (const [pal, idx, code] of entries)
          append(Uint8Array.of(pal * 40 + idx, code));
        break;
      }
      case 'CEL': {
        /** TODO unsupported */
        break;
      }
      case 'SET_MONO_PALETTE': {
        const [, pal, ...entries] = cmd;
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.SetMonoPalette, pal));
        const palData = new Uint8Array(40);
        palData.set(entries);
        append(palData);
        break;
      }
      case 'SET_MONO': {
        const [, value] = cmd;
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.SetMono, value));
        break;
      }
      case 'SET_MONO_DIRECT': {
        const [, value] = cmd;
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.SetMonoDirect, value));
        break;
      }
      case 'CLEAR_MONO': {
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.ClearMono));
        break;
      }
      case 'CLEAR_MONO_DIRECT': {
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.ClearMonoDirect));
        break;
      }
      case 'SET_PRIORITY_BANDS': {
        const [, , ...entries] = cmd;
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.SetPriorityBands));
        append(Uint8Array.from(entries));
        break;
      }
      default:
        exhaustive(`branch not handled!`, mode);
    }
  }

  chunks.push(Uint8Array.of(OpCode.Done));

  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
