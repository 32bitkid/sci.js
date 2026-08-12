import { defineConfig } from 'tsdown/config';
import packageJSON from './package.json' with { type: 'json' };

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'node',
  format: ['esm'],
  target: ['node24'],
  unbundle: true,
  env: {
    __VERSION__: packageJSON.version,
  },
  outputOptions: {
    comments: { legal: true, annotation: true, jsdoc: false },
  },
});
