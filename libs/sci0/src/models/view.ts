import { Cel } from './cel';

export interface Loop {
  frames: Cel[];
  isMirrored: boolean;
  bounds: [left: number, top: number, right: number, bottom: number];
}

export type View = Loop[];
