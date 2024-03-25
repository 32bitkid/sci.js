import { Cel } from './cel';

export interface Loop {
  frames: Cel[];
  isMirrored: boolean;
}

export type View = Loop[];
