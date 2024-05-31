import type { ComputedRef, Ref } from 'vue';

import type { PaletteSet } from '../../helpers/palette-helpers.ts';

export interface PaletteStore {
  readonly contrast: Ref<number | false>;
  readonly baseColors: Ref<Uint32Array>;
  readonly variant: Ref<0 | 1 | 2 | 3>;
  readonly finalColors: ComputedRef<Uint32Array>;
  readonly paletteSetStack: ComputedRef<PaletteSet[]>;
  readonly topPaletteSet: ComputedRef<PaletteSet>;
  readonly currentPalette: ComputedRef<number[]>;
}
