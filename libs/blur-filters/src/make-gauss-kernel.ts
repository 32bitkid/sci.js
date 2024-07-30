export function makeGaussKernel(sigma: number): Float64Array {
  const GAUSSIAN_KERNEL = 6.0;
  const dim = ~~Math.max(3.0, GAUSSIAN_KERNEL * sigma);
  const sqrtSigmaPi2 = Math.sqrt(Math.PI * 2.0) * sigma;
  const s2 = 2.0 * sigma * sigma;

  let sum = 0.0;

  const kernel = new Float64Array(dim - (~dim & 1)); // Make it odd number
  const half = kernel.length >> 1;
  for (let j = 0, i = -half; j < kernel.length; i++, j++) {
    kernel[j] = Math.exp(-(i * i) / s2) / sqrtSigmaPi2;
    sum += kernel[j];
  }
  // Normalize the gaussian kernel to prevent image darkening/brightening
  for (let i = 0; i < dim; i++) {
    kernel[i] /= sum;
  }
  return kernel;
}
