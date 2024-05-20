<script setup lang="ts">
import { computed } from 'vue';
import { getPals } from '../helpers/getPals.ts';
import store from '../data/store';
import DrawCommandItem from './DrawCommandItem.vue';
import PolyLineCommandItem from './PolyLineCommandItem.vue';

const stack = computed(() => [...store.cmds.value].reverse());

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
  <h2 :class="$style.head">Layer</h2>
  <ol :class="$style.list">
    <li :class="[$style.item, $style.header]">
      <div>Tool</div>
      <div>V</div>
      <div>P</div>
      <div>C</div>
    </li>
    <component
      v-for="(item, idx) in stack"
      :is="itemType[item[0]]"
      :command="item"
      :pals="getPals(stack.slice(idx))"
      :class="[
        $style.item,
        idx === store.cmdIdx && $style.current,
        idx < store.cmdIdx && $style.hidden,
      ]"
      @click="store.cmdIdx = idx"
    />
  </ol>
</template>

<style module>
.head {
  font-weight: bold;
  padding-inline-start: 0.5ch;
  padding-block-end: 0.5ch;
  margin-top: 0.5lh;
}

.list {
  font: normal normal 0.75em monospace;
  box-sizing: border-box;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: var(--clr-ink-A50) transparent;
  scrollbar-gutter: stable;
  border: 1px inset var(--clr-ink-A10);
  display: grid;
  flex-direction: column;
  grid-template-columns: 1fr 1.5rem 1rem 1rem 1px;
  column-gap: 0.5ch;
}

.header:first-child {
  z-index: 1;
  position: sticky;
  top: 0;
  background-color: white;
  font-size: 0.9em;
  box-shadow: 0 0.125em 0.5em rgba(0 0 0 / 10%);
  font-weight: bold;
  & > div:nth-child(n + 2) {
    text-align: center;
  }
}

.item {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  padding-block: 0.5lh;
  padding-inline-start: 0.5ch;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  &:first-child {
    border-top: 0;
  }
  cursor: pointer;
}

.current {
  background-color: var(--clr-primary-800);
}

.hidden {
  opacity: 0.25;
}
</style>
