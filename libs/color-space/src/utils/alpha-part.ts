import { formatFloat } from './format-float';

export const alphaPart = (alpha: number | undefined) =>
  alpha === undefined ? '' : ` / ${formatFloat(alpha)}`;
