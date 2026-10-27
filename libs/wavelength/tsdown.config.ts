import { defineConfig } from 'tsdown/config';

export default defineConfig({
  entry: ['./src/index.ts', './src/wavelength.ts'],
  platform: 'neutral',
  format: ['esm'],
  target: ['node20'],
  outputOptions: {
    comments: { legal: true, annotation: true, jsdoc: false },
  },
});
