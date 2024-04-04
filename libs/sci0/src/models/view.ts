import { Cel } from './cel';

export interface Loop {
  readonly frames: Cel[];
  readonly isMirrored: boolean;
  readonly bounds: {
    readonly left: number;
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly width: number;
    readonly height: number;
  };
}

export type View = Loop[];
