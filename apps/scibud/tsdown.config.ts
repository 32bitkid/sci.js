import { defineConfig } from 'tsdown/config';

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'node',
  format: ['esm'],
  target: ['node20'],
  unbundle: false,
  outputOptions: {
    comments: { legal: true, annotation: true, jsdoc: false },
  },
});
