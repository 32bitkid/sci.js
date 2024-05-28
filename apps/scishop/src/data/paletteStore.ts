import { computed, ref, unref } from 'vue';

import {
  DrawCodes,
  DrawMode,
  isControlMode,
  isPriorityMode,
  isVisualMode,
} from '@4bitlabs/sci0';
import { IBM5153Contrast, Palettes } from '@4bitlabs/color';
import { DEFAULT_PALETTE, mapToPals } from '../helpers/palette-helpers.ts';
import store from './picStore.ts';

export const drawState = ref<[DrawMode, ...DrawCodes]>([
  DrawMode.Visual | DrawMode.Priority,
  0,
  0,
  0,
]);

const changeDrawMode = (mode: DrawMode, flag: DrawMode, enabled: boolean) =>
  enabled ? mode | flag : mode & ~flag;

export const visualEnabled = computed<boolean>({
  get: () => isVisualMode(unref(drawState)[0]),
  set(next) {
    drawState.value[0] = changeDrawMode(
      unref(drawState)[0],
      DrawMode.Visual,
      next,
    );
  },
});
export const visualCode = computed<number>({
  get: () => unref(drawState)[1],
  set(next) {
    drawState.value[0] |= DrawMode.Visual;
    drawState.value[1] = next;
  },
});

export const priorityEnabled = computed<boolean>({
  get: () => isPriorityMode(unref(drawState)[0]),
  set(next) {
    drawState.value[0] = changeDrawMode(
      unref(drawState)[0],
      DrawMode.Priority,
      next,
    );
  },
});
export const priorityCode = computed<number>({
  get: () => unref(drawState)[2],
  set(next) {
    drawState.value[0] |= DrawMode.Control;
    drawState.value[2] = next;
  },
});

export const controlEnabled = computed<boolean>({
  get: () => isControlMode(unref(drawState)[0]),
  set(next) {
    drawState.value[0] = changeDrawMode(
      unref(drawState)[0],
      DrawMode.Control,
      next,
    );
  },
});
export const controlCode = computed<number>({
  get: () => unref(drawState)[3],
  set(next) {
    drawState.value[0] |= DrawMode.Control;
    drawState.value[3] = next;
  },
});

export const selectedPaletteRef = ref<0 | 1 | 2 | 3>(0);
export const baseScreenPalette = ref(Palettes.TRUE_CGA_PALETTE);
export const screenPalette = computed(() =>
  IBM5153Contrast(unref(baseScreenPalette), 0.4),
);

export const paletteSetStack = computed(() => mapToPals(store.layers));

export const topPaletteSet = computed(() => {
  return store.topIdx > 0
    ? unref(paletteSetStack)[store.topIdx - 1]
    : [DEFAULT_PALETTE, DEFAULT_PALETTE, DEFAULT_PALETTE, DEFAULT_PALETTE];
});

export const palette = computed(
  () => unref(topPaletteSet)[unref(selectedPaletteRef)],
);
