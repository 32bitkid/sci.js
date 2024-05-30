<script setup lang="ts">
import { BrushCommand } from '@4bitlabs/sci0';
import Swatches from './Swatches.vue';

const { command, pals } = defineProps<{
  command: BrushCommand;
  pals: [number[], number[], number[], number[]];
}>();

const [, options] = command;
const [drawMode, drawCode, size, isRect, isSpray] = options;
</script>

<template>
  <li>
    <div>
      {{ isSpray ? 'Spray' : 'Solid' }}
      {{ isRect ? 'Square' : 'Circle' }}
      Brush Size {{ size }}
    </div>
    <Swatches :drawMode="drawMode" :drawCode="drawCode" :pals="pals" />
  </li>
</template>
