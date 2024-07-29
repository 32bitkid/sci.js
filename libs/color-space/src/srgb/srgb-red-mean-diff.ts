import { sRGBTuple } from '../tuples/srgb-tuple';

/** @hidden */
export const redMeanDiff = (c1: sRGBTuple, c2: sRGBTuple): number => {
  const [, c1R, c1G, c1B] = c1;
  const [, c2R, c2G, c2B] = c2;

  const aR = (c1R + c2R) / 2;
  const dR = Math.abs(c1R - c2R);
  const dG = Math.abs(c1G - c2G);
  const dB = Math.abs(c1B - c2B);

  return (
    (2 + aR / 256) * dR ** 2 + 4 * dG ** 2 + (2 + (255 - aR) / 256) * dB ** 2
  );
};
