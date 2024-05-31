import { type ShallowRef, type Ref, computed, ref, unref, provide } from 'vue';

import { IBM5153Contrast, Palettes } from '@4bitlabs/color';
import { DEFAULT_PALETTE, mapToPals } from '../helpers/palette-helpers.ts';
import type { EditorCommand } from '../models/EditorCommand.ts';
import { paletteKey } from './keys.ts';

export function usePaletteProvider(deps: {
  layersRef: ShallowRef<EditorCommand[]>;
  topIdxRef: Ref<number>;
}) {
  const { layersRef, topIdxRef } = deps;

  const baseRef = ref(Palettes.TRUE_CGA_PALETTE);
  const contrastRef = ref<number | false>(0.4);
  const variantRef = ref<0 | 1 | 2 | 3>(0);

  const finalRef = computed(() => {
    const base = unref(baseRef);
    const contrast = unref(contrastRef);
    return contrast !== false ? IBM5153Contrast(base, contrast) : base;
  });

  const paletteSetStackRef = computed(() => mapToPals(unref(layersRef)));
  const topPaletteSetRef = computed(() => {
    const top = unref(topIdxRef);
    return (
      unref(paletteSetStackRef)[top - 1] ?? [
        DEFAULT_PALETTE,
        DEFAULT_PALETTE,
        DEFAULT_PALETTE,
        DEFAULT_PALETTE,
      ]
    );
  });

  const currentPaletteRef = computed(
    () => unref(topPaletteSetRef)[unref(variantRef)],
  );

  provide(paletteKey, {
    contrast: contrastRef,
    baseColors: baseRef,
    variant: variantRef,
    // computed
    finalColors: finalRef,
    paletteSetStack: paletteSetStackRef,
    topPaletteSet: topPaletteSetRef,
    currentPalette: currentPaletteRef,
  });
}
