import { type XYZTuple, create } from '@4bitlabs/color-space/xyz';

const xFit_1931 = (v: number): number => {
  const t1: number = (v - 442.0) * (v < 442.0 ? 0.0624 : 0.0374);
  const t2: number = (v - 599.8) * (v < 599.8 ? 0.0264 : 0.0323);
  const t3: number = (v - 501.1) * (v < 501.1 ? 0.049 : 0.0382);
  return (
    0.362 * Math.exp(-0.5 * t1 * t1) +
    1.056 * Math.exp(-0.5 * t2 * t2) -
    0.065 * Math.exp(-0.5 * t3 * t3)
  );
};

const yFit_1931 = (v: number): number => {
  const t1: number = (v - 568.8) * (v < 568.8 ? 0.0213 : 0.0247);
  const t2: number = (v - 530.9) * (v < 530.9 ? 0.0613 : 0.0322);
  return 0.821 * Math.exp(-0.5 * t1 * t1) + 0.286 * Math.exp(-0.5 * t2 * t2);
};

const zFit_1931 = (v: number): number => {
  const t1: number = (v - 437.0) * (v < 437.0 ? 0.0845 : 0.0278);
  const t2: number = (v - 459.0) * (v < 459.0 ? 0.0385 : 0.0725);
  return 1.217 * Math.exp(-0.5 * t1 * t1) + 0.681 * Math.exp(-0.5 * t2 * t2);
};

/** Adapted from https://jcgt.org/published/0002/02/01/paper.pdf */
export const wavelengthI = (
  v: number,
  intensity: number = 1,
  out: XYZTuple = create(),
): XYZTuple => {
  out[1] = xFit_1931(v) * (100 * intensity);
  out[2] = yFit_1931(v) * (100 * intensity);
  out[3] = zFit_1931(v) * (100 * intensity);
  return out;
};

export const wavelength = (v: number, out?: XYZTuple): XYZTuple =>
  wavelengthI(v, undefined, out);
