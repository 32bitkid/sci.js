import type { Pic } from '../models/pic.js';
import { exhaustive } from '../utils/exhaustive.js';
import { ExtendedOpCode, OpCode } from '../parsers/pic/op-codes.js';
import { createState } from './pic-state.js';
import {
  plineMaxDelta,
  p16,
  p8,
  relativePoints,
  absolutePoints,
} from './point-encoders.js';

export function encodePic(pic: Pic): Uint8Array {
  const chunks: Uint8Array[] = [];
  const append = (chunk: Uint8Array) => chunks.push(chunk);
  const appendAll = (iter: Iterable<Uint8Array>) => {
    for (const chunk of iter) {
      chunks.push(chunk);
    }
  };

  const updateState = createState();

  for (const cmd of pic) {
    const [mode] = cmd;
    switch (mode) {
      case 'PLINE': {
        const [, [drawMode, drawCodes], ...points] = cmd;
        appendAll(updateState({ mode: drawMode, codes: drawCodes }));
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
        const [, [drawMode, drawCodes], ...points] = cmd;
        appendAll(updateState({ mode: drawMode, codes: drawCodes }));
        append(Uint8Array.of(OpCode.Fills));
        appendAll(absolutePoints(points));
        break;
      }
      case 'BRUSH': {
        const [, [drawMode, drawCodes]] = cmd;
        appendAll(updateState({ mode: drawMode, codes: drawCodes }));
        break;
      }
      case 'SET_PALETTE': {
        const [, [pal], ...entries] = cmd;
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.SetPalette, pal));
        append(Uint8Array.from(entries));
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
        const [, [pal], ...entries] = cmd;
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.SetMonoPalette, pal));
        append(Uint8Array.from(entries));
        break;
      }
      case 'SET_MONO_1': {
        const [, [value]] = cmd;
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.SetMono1, value));
        break;
      }
      case 'SET_MONO_2': {
        const [, [value]] = cmd;
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.SetMono2, value));
        break;
      }
      case 'CLEAR_MONO_1': {
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.ClearMono1));
        break;
      }
      case 'CLEAR_MONO_2': {
        append(Uint8Array.of(OpCode.XOp, ExtendedOpCode.ClearMono2));
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
