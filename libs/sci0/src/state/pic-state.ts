import type { DrawMode } from '../models/draw-mode.js';
import type { DrawCodes } from '../models/draw-codes.js';
import type { PatternCode } from '../models/pattern-code.js';

export interface PicState {
  drawMode: DrawMode;
  drawCodes: DrawCodes;
  patternCode: PatternCode;
  palette: Uint8Array;
  monoPalette: Uint8Array;
}
