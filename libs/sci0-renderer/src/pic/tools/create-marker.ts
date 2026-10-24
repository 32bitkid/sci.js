import type { PicState } from '@4bitlabs/sci0';
import type { Filler, Plotter } from './screen.js';

export const createMarker = (plot: Plotter): Filler =>
  function marker(state: PicState, x: number, y: number): void {
    plot(state, x - 1, y);
    plot(state, x, y - 1);
    plot(state, x + 1, y);
    plot(state, x, y + 1);
  };
