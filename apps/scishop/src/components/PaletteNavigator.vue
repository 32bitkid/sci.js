<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import store from '../data/store.ts';
import { mapToPals } from '../helpers/getPals.ts';
import { IBM5153Contrast, Palettes } from '@4bitlabs/color';
import { fromUint32, toHex } from '@4bitlabs/color-space/srgb';

const palRef = ref<number>(0);

const Pal = IBM5153Contrast(Palettes.TRUE_CGA_PALETTE, 0.4);

const splitPalEntry = (pair: number) => {
  const [aClr, bClr] = [Pal[pair >>> 4], Pal[pair & 0b1111]];

  return {
    '--dither-left': toHex(fromUint32(aClr)),
    '--dither-right': toHex(fromUint32(bClr)),
  };
};

const pal = computed(
  () => mapToPals(unref(store.cmds))[store.cmdIdx ?? store.topIdx],
);
</script>

<template>
  <div :class="$style.panel">
    <header :class="$style.header">Palette</header>
    <ol :class="$style.buttonBar">
      <li>
        <button :class="{ [$style.palSel]: palRef === 0 }" @click="palRef = 0">
          0
        </button>
      </li>
      <li>
        <button :class="{ [$style.palSel]: palRef === 1 }" @click="palRef = 1">
          1
        </button>
      </li>
      <li>
        <button :class="{ [$style.palSel]: palRef === 2 }" @click="palRef = 2">
          2
        </button>
      </li>
      <li>
        <button :class="{ [$style.palSel]: palRef === 3 }" @click="palRef = 3">
          3
        </button>
      </li>
    </ol>
    <ol :class="$style.grid">
      <li
        v-for="_ in pal[palRef]"
        :class="$style.swatch"
        :style="[splitPalEntry(_)]"
      ></li>
    </ol>
  </div>
</template>

<style module>
.panel {
  scrollbar-width: auto;
  scrollbar-gutter: stable;
}

.header {
  font-size: 0.85rem;
  font-weight: bold;
  padding-inline-start: 0.5ch;
  padding-block: 0.5lh 0.5ch;
}

.buttonBar {
  display: flex;
  padding-inline: 0.5ch;
  align-items: flex-end;
  border-bottom: 1px solid black;
  margin-bottom: 0.25lh;
  margin-top: 0.25lh;
}

.buttonBar li {
  flex-grow: 1;
}

.buttonBar li button {
  width: 100%;
  cursor: pointer;
  padding: 0.5ch 0.25ch 0.25ch;
  text-align: center;
  font-size: 0.75rem;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-top: 1px solid var(--clr-ink-A20);
  border-left: 1px solid var(--clr-ink-A20);
  border-right: 1px solid var(--clr-ink-A20);
  background-color: var(--clr-surface--default);
}

.buttonBar li button.palSel {
  background-color: var(--clr-primary-800);
  border-top-color: var(--clr-primary-500);
  border-left: 1px solid var(--clr-ink-A30);
  border-right: 1px solid var(--clr-ink-A30);
  border-top-width: 3px;
  padding-top: calc(0.5ch - 1px);
  margin-bottom: -1px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 3px;
  padding: 0 0.5ch 0.5ch;
}

.swatch {
  aspect-ratio: 1 / 1;
  background-image: conic-gradient(
    var(--dither-left, black) 0turn 0.25turn,
    var(--dither-right, white) 0.25turn 0.5turn,
    var(--dither-left, black) 0.5turn 0.75turn,
    var(--dither-right, white) 0.75turn 1turn
  );
  background-repeat: repeat;
  background-size: 2px 2px;
  background-position: top left;
  border: 1px solid black;
  overflow: hidden;
  transition: background-size 500ms;
}

.swatch:hover {
  background-size: 100% 100%;
}
</style>
