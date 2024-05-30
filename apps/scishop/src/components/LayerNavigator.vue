<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import store from '../data/picStore';
import GenericCommandItem from './command-items/GenericCommandItem.vue';
import PolyLineCommandItem from './command-items/PolyLineCommandItem.vue';
import FillCommandItem from './command-items/FillCommandItem.vue';
import BrushCommandItem from './command-items/BrushCommandItem.vue';
import SetPaletteCommand from './command-items/SetPaletteCommand.vue';
import { paletteSetStack, drawState } from '../data/paletteStore.ts';
import {
  DrawCommand,
  FillCommand,
  PolylineCommand,
  BrushCommand,
} from '@4bitlabs/sci0';

const stack = computed(() => Array.from(store.layers.entries()).reverse());

const component = new Map<string, Component>([
  ['SET_PALETTE', SetPaletteCommand],
  ['UPDATE_PALETTE', GenericCommandItem],
  ['BRUSH', BrushCommandItem],
  ['FILL', FillCommandItem],
  ['PLINE', PolyLineCommandItem],
  ['CEL', GenericCommandItem],
  ['group', GenericCommandItem],
]);

function isHasDrawModes(
  it: DrawCommand,
): it is FillCommand | PolylineCommand | BrushCommand {
  return it[0] === 'FILL' || it[0] === 'PLINE' || it[0] === 'BRUSH';
}

const handleClick = (e: MouseEvent, idx: number) => {
  if (e.shiftKey) {
    store.topIdx = idx + 1;
  }

  store.selection = store.selection !== idx ? idx : null;
  const ecmd = store.layers[idx];
  const lastCmd = ecmd.commands.findLast(isHasDrawModes);
  if (lastCmd) {
    const [, options] = lastCmd;
    const [drawMode, drawCodes] = options;
    drawState.value = [drawMode, ...drawCodes];
  }
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
      v-for="[idx, { id, type, commands }] in stack"
      :key="id"
      :is="component.get(type) ?? GenericCommandItem"
      :command="commands[0]"
      :pals="paletteSetStack[idx]"
      :class="[
        $style.item,
        idx === store.selection && $style.current,
        idx >= store.topIdx && $style.hidden,
        idx === store.topIdx - 1 && $style.top,
      ]"
      @click="handleClick($event, idx)"
    />
  </menu>
</template>

<style module>
.list {
  --lnc-item-height: 32px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1.4rem 1rem 1rem 1px;
  grid-template-rows: auto;
  grid-auto-rows: var(--lnc-item-height);
  column-gap: 0.5ch;
  overflow-x: clip;
  overflow-y: auto;
  scrollbar-width: thin;
  align-items: center;
  align-content: start;
  padding-bottom: 0.5lh;
  background-image: var(--transparent-img);
  background-color: var(--clr-surface--default);
  min-height: 15rem;
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
  border-bottom: 1px solid var(--clr-surface-200);
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
  align-content: center;
  background-color: var(--clr-surface--default);
  background-clip: padding-box;
  height: var(--lnc-item-height);
  box-sizing: border-box;
}

.item:last-of-type {
  box-shadow: 0 0.125em 0.5em rgba(0 0 0 / 10%);
}

.top {
  padding-block: 0.5lh;
  border-top: 2px dashed var(--clr-primary-700);
}

.current {
  background-color: var(--clr-primary-800);
}

.hidden > * {
  opacity: 0.25;
}
</style>
