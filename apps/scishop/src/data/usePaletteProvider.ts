import { type ShallowRef, type Ref, computed, ref, unref, provide } from 'vue';
import deepEqual from 'fast-deep-equal';

import { IBM5153Contrast, Palettes } from '@4bitlabs/color';
import { DrawCommand } from '@4bitlabs/sci0';
import {
  DEFAULT_PALETTE,
  IndexedPaletteSet,
  PaletteSet,
  reduceMutations,
} from '../helpers/palette-helpers.ts';
import { EditorCommand } from '../models/EditorCommand.ts';
import { paletteKey } from './keys.ts';

const DEFAULT_PALETTE_SET: PaletteSet = [
  DEFAULT_PALETTE,
  DEFAULT_PALETTE,
  DEFAULT_PALETTE,
  DEFAULT_PALETTE,
];

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

  const paletteMutationsRef = computed<[number, DrawCommand][]>((prev = []) => {
    const layers = unref(layersRef);
    const next = Array.from(layers.entries())
      .filter(
        ([, it]) => it.type === 'SET_PALETTE' || it.type === 'UPDATE_PALETTE',
      )
      .flatMap<[number, DrawCommand]>(([idx, it]) =>
        it.commands.map((cmd) => [idx, cmd]),
      );
    return deepEqual(prev, next) ? prev : next;
  });

  const paletteSetChangesRef = computed<IndexedPaletteSet[]>((prev = []) => {
    const mutations = unref(paletteMutationsRef);
    const next = reduceMutations(mutations);
    return deepEqual(prev, next) ? prev : next;
  });

  function resolvePaletteAtIdx(n: number): PaletteSet {
    const changes = unref(paletteSetChangesRef);
    const found = changes.findLast(([idx]) => idx < n);
    if (!found) return DEFAULT_PALETTE_SET;
    const [, actual] = found;
    return actual;
  }

  const topPaletteSetRef = computed(() =>
    resolvePaletteAtIdx(unref(topIdxRef)),
  );

  const currentPaletteRef = computed(
    () => unref(topPaletteSetRef)[unref(variantRef)],
  );

  provide(paletteKey, {
    contrast: contrastRef,
    baseColors: baseRef,
    variant: variantRef,
    // computed
    finalColors: finalRef,
    topPaletteSet: topPaletteSetRef,
    currentPalette: currentPaletteRef,
    resolvePaletteAtIdx,
  });
}
