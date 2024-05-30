<script setup lang="ts">
import { FillCommand } from '@4bitlabs/sci0';
import Swatches from './Swatches.vue';

const { command, pals } = defineProps<{
  command: FillCommand;
  pals: [number[], number[], number[], number[]];
}>();

const [, options] = command;
const [drawMode, drawCode] = options;
</script>

<template>
  <li>
    <div>Fill</div>
    <Swatches :drawMode="drawMode" :drawCode="drawCode" :pals="pals" />
  </li>
</template>
