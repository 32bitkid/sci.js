import { DrawMode } from '../../models/draw-mode.js';
import type { DrawCodes } from '../../models/draw-codes.js';
import type { PatternCode } from '../../models/pattern-code.js';

export interface PicState {
  drawMode: DrawMode;
  drawCodes: DrawCodes;
  patternCode: PatternCode;
}

export const createPicState = (): PicState => ({
  drawMode: DrawMode.Visual | DrawMode.Priority,
  drawCodes: [0, 0, 0],
  patternCode: [0, false, false],
});
