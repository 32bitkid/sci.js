import { Cel } from './cel';

export interface ViewGroup {
  frames: Cel[];
  isMirrored: boolean;
}

export type View = ViewGroup[];
