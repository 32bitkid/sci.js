interface RGBA {
  r: number;
  g: number;
  b: number;
  a?: number;
}

type ColorTuple = Readonly<[number, number, number, number?]>;

export const redMeanDiff = (c1: RGBA | ColorTuple, c2: RGBA | ColorTuple) => {
  const [c1R, c1G, c1B] = !('r' in c1) ? c1 : [c1.r, c1.g, c1.b];
  const [c2R, c2G, c2B] = !('r' in c2) ? c2 : [c2.r, c2.g, c2.b];

  const aR = (c1R + c2R) / 2;
  const dR = Math.abs(c1R - c2R);
  const dG = Math.abs(c1G - c2G);
  const dB = Math.abs(c1B - c2B);

  return (
    (2 + aR / 256) * dR ** 2 + 4 * dG ** 2 + (2 + (255 - aR) / 256) * dB ** 2
  );
};
