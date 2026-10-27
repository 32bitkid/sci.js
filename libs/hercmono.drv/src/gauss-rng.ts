function boxMuller(rng: () => number, μ: number = 0, σ: number = 1) {
  const u = 1 - rng();
  const v = rng();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * σ + μ;
}

export type GaussianDistributionRng = (μ: number, σ: number) => number;

export const createGaussRng =
  (baseRng: () => number): GaussianDistributionRng =>
  (μ: number, σ: number) =>
    boxMuller(baseRng, μ, σ);

export const gaussRng: GaussianDistributionRng = createGaussRng(Math.random);
