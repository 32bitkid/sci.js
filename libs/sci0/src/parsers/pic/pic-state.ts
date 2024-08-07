import { DrawMode } from '../../models/draw-mode';
import { DrawCodes } from '../../models/draw-codes';
import { PatternCode } from '../../models/pattern-code';

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
