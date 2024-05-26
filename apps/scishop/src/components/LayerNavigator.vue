<script setup lang="ts">
import { computed } from 'vue';
import { mapToPals } from '../helpers/getPals';
import store from '../data/picStore';
import DrawCommandItem from './DrawCommandItem.vue';
import PolyLineCommandItem from './PolyLineCommandItem.vue';

const stack = computed(() => Array.from(store.layers.entries()).reverse());
const stackPalettes = computed(() => mapToPals(store.layers));

const itemType = {
  SET_PALETTE: DrawCommandItem,
  UPDATE_PALETTE: DrawCommandItem,
  BRUSH: PolyLineCommandItem,
  FILL: PolyLineCommandItem,
  PLINE: PolyLineCommandItem,
  CEL: DrawCommandItem,
};
</script>

<template>
  <menu :class="$style.list">
    <li :class="$style.head">
      <div>Layer</div>
      <div>Tool</div>
      <div>V</div>
      <div>P</div>
      <div>C</div>
    </li>
    <component
      v-for="[idx, item] in stack"
      :key="JSON.stringify(item)"
      :is="itemType[item[0]]"
      :command="item"
      :pals="stackPalettes[idx]"
      :class="[
        $style.item,
        idx === store.cmdIdx && $style.current,
        idx > store.topIdx && $style.hidden,
        idx === store.topIdx && $style.top,
      ]"
      @dblclick="store.topIdx = idx"
    />
  </menu>
</template>

<style module>
.list {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1.4rem 1rem 1rem 1px;
  column-gap: 0.5ch;
  overflow-x: clip;
  overflow-y: auto;
  scrollbar-width: thin;
  align-items: start;
  align-content: start;
  flex-grow: 1;
  margin-bottom: 0.25lh;
  padding-bottom: 0.5lh;
  border-bottom-left-radius: 0.5lh;
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(0 0 0 / 5%) 0px,
    rgba(0 0 0 / 5%) 5px,
    rgba(0 0 0 / 0%) 5px,
    rgba(0 0 0 / 0%) 10px
  );
}

.head {
  display: grid;
  grid-template-columns: subgrid;
  position: sticky;
  top: 0;
  background-color: var(--clr-surface--default);
  grid-column: 1 / -1;
  box-shadow: 0 0.125em 0.5em rgba(0 0 0 / 10%);
  z-index: 1;
}

.head :nth-child(1) {
  font-size: 0.85rem;
  font-weight: bold;
  padding-inline-start: 0.5ch;
  padding-block: 0.5lh 0.5ch;
  grid-column: 1 / -1;
  border-bottom: 1px solid var(--clr-ink-A10);
}

.head :nth-child(n + 2) {
  padding-block: 0.5lh;
  padding-inline-start: 0.5ch;
  font: normal normal 0.75em monospace;
  font-weight: bold;
}

.head :nth-child(n + 3) {
  text-align: center;
}

.item {
  font: normal normal 0.75em monospace;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  padding-block: calc(0.5lh + 1px) 0.5lh;
  padding-inline-start: 0.5ch;
  border-top: 1px solid #ddd;
  cursor: pointer;
  user-select: none;
  background-color: var(--clr-surface--default);
}

.item:last-of-type {
  box-shadow: 0 0.125em 0.5em rgba(0 0 0 / 10%);
}

.top {
  padding-block: 0.5lh;
  border-top: 2px dashed var(--clr-primary-800);
}

.current {
  background-color: var(--clr-primary-800);
}

.hidden > * {
  opacity: 0.25;
}
</style>
