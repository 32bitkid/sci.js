<script setup lang="ts">
import { PolylineCommand, BrushCommand } from '@4bitlabs/sci0';
import Swatches from './Swatches.vue';

const { command, pals } = defineProps<{
  command: PolylineCommand | BrushCommand;
  pals: [number[], number[], number[], number[]];
}>();

const [, options, ...coords] = command;
const [drawMode, drawCode] = options;
</script>

<template>
  <li>
    <div>Line ({{ coords.length }})</div>
    <Swatches :drawMode="drawMode" :drawCode="drawCode" :pals="pals" />
  </li>
</template>
