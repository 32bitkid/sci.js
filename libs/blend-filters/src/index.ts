import { createBlendFilter, type BlendFilter } from './create-blend-filter.js';
import {
  screen,
  multiply,
  lightenOnly,
  softLight,
  hardLight,
  type BlendMode,
  darkenOnly,
} from './blend-modes.js';

export { blend } from './blend.js';
export { createBlendFilter, type BlendFilter };
export type { BlendMode };

export const BlendModes: {
  darkenOnly: BlendMode;
  hardLight: BlendMode;
  lightenOnly: BlendMode;
  multiply: BlendMode;
  screen: BlendMode;
  softLight: BlendMode;
} = { screen, multiply, lightenOnly, softLight, hardLight, darkenOnly };

export const darkenOnlyFilter: BlendFilter = createBlendFilter(darkenOnly);
export const hardLightFilter: BlendFilter = createBlendFilter(hardLight);
export const lightenOnlyFilter: BlendFilter = createBlendFilter(lightenOnly);
export const multiplyFilter: BlendFilter = createBlendFilter(multiply);
export const screenFilter: BlendFilter = createBlendFilter(screen);
export const softLightFilter: BlendFilter = createBlendFilter(softLight);
