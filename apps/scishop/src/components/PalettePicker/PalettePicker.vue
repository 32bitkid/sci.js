<script setup lang="ts">
import { ref, unref, computed } from 'vue';
import { fromUint32, toHex } from '@4bitlabs/color-space/srgb';
import ModeSelector from './ModeSelector.vue';
import {
  screenPalette,
  palette,
  visualEnabled,
  priorityEnabled,
  controlEnabled,
  visualCode,
  priorityCode,
  controlCode,
} from '../../data/paletteStore.ts';
import { zoomRef } from '../../data/viewStore';

const ditherSize = computed(() => {
  const zoom = unref(zoomRef);
  const pixelSize = Math.min(12, Math.max(1, zoom));
  return `${Math.round(pixelSize) * 2}px`;
});

const mode = ref<'v' | 'p' | 'c' | 'none'>('v');

const getSingle = (Pal: Uint32Array, idx: number) =>
  toHex(fromUint32(Pal[idx]));

const getDitherPair = (Pal: Uint32Array, pair: number) => {
  const [aClr, bClr] = [Pal[pair >>> 4], Pal[pair & 0b1111]];
  return {
    '--dither-left': toHex(fromUint32(aClr)),
    '--dither-right': toHex(fromUint32(bClr)),
  };
};

const getDitherComponents = (
  cga: Uint32Array,
  palette: number[],
  idx: number,
): [string, string] => {
  const pair = palette[idx];
  return [
    toHex(fromUint32(cga[pair >>> 4])),
    toHex(fromUint32(cga[pair & 0b1111])),
  ];
};
</script>

<template>
  <div :class="$style.panel">
    <header :class="$style.header">Color</header>
    <div :class="$style.container">
      <menu :class="$style.vpc">
        <li>
          <ModeSelector
            title="Visual"
            v-model:enabled="visualEnabled"
            :selected="mode === 'v'"
            @update:select="mode = 'v'"
            :color="getDitherComponents(screenPalette, palette, visualCode)"
          />
        </li>
        <li>
          <ModeSelector
            title="Priority"
            v-model:enabled="priorityEnabled"
            :selected="mode === 'p'"
            @update:select="mode = 'p'"
            :color="getSingle(screenPalette, priorityCode)"
          />
        </li>
        <li>
          <ModeSelector
            title="Control"
            v-model:enabled="controlEnabled"
            :selected="mode === 'c'"
            @update:select="mode = 'c'"
            :color="getSingle(screenPalette, controlCode)"
          />
        </li>
      </menu>
      <menu :class="$style.grid" v-if="mode === 'v'">
        <li v-for="(_, idx) in palette">
          <button
            :class="[
              $style.swatch,
              visualEnabled && idx === visualCode && $style.selected,
            ]"
            :style="[getDitherPair(screenPalette, _)]"
            @click="visualCode = idx"
          ></button>
        </li>
      </menu>
    </div>
  </div>
</template>

<style module>
.panel {
  background-color: var(--clr-surface--default);
}

.container {
  display: grid;
  grid-template-columns: 4rem auto;
  padding-block: 0.5lh;
}

.vpc {
  display: flex;
  flex-direction: column;
  gap: 0.5lh;
  padding-right: 0.3ch;
  justify-content: space-around;
  border-right: 1px dotted var(--clr-surface-200);
}

.vpc > li {
  display: flex;
}

.header {
  font-size: 0.85rem;
  font-weight: bold;
  padding-inline-start: 0.5ch;
  padding-block: 0.5lh 0.5ch;
  border-bottom: 1px solid var(--clr-surface-200);
}

.grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 3.5px;
  padding: 0 0.5ch;
}

.swatch {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-image: conic-gradient(
    var(--dither-left, black) 0turn 0.25turn,
    var(--dither-right, white) 0.25turn 0.5turn,
    var(--dither-left, black) 0.5turn 0.75turn,
    var(--dither-right, white) 0.75turn 1turn
  );
  background-repeat: repeat;
  background-size: v-bind(ditherSize) v-bind(ditherSize);
  background-position: top left;
  border: 1px solid black;
  overflow: hidden;
  border-radius: 2px;
}

.swatch.selected {
  border-color: var(--clr-primary-900);
  outline: 0.2ch solid var(--clr-primary);
  z-index: 1;
}
</style>
