import { DrawCodes, DrawMode, PatternCode } from '../../models/draw-command';

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
