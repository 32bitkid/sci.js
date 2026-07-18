import { formatFloat } from './format-float.js';
import { clamp } from './clamp.js';

export const alphaPart = (alpha: number | undefined): string =>
  alpha === undefined ? '' : ` / ${formatFloat(clamp(alpha, 0, 1))}`;
