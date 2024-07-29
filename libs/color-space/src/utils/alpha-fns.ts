import { formatFloat } from './format-float';
import { clamp } from './clamp';

export const alphaPart = (alpha: number | undefined): string =>
  alpha === undefined ? '' : ` / ${formatFloat(clamp(alpha, 0, 1))}`;
