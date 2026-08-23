import { defineConfig } from 'tsdown/config';
import packageJSON from './package.json' with { type: 'json' };

export default defineConfig({
  entry: ['./src/main.ts', './src/process.ts'],
  platform: 'node',
  format: ['esm'],
  target: ['node24'],
  unbundle: false,
  env: {
    __VERSION__: packageJSON.version,
  },
  outputOptions: {
    comments: { legal: true, annotation: true, jsdoc: false },
  },
});
