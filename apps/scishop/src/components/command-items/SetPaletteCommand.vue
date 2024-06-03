<script setup lang="ts">
import { SetPaletteCommand } from '@4bitlabs/sci0';
import { computed } from 'vue';
const props = defineProps<{ command: SetPaletteCommand; pals: unknown }>();
const pal = computed(() => {
  const [_, options] = props.command;
  return options[0];
});
</script>

<template>
  <li>{{ command[0] }}: {{ pal }}</li>
</template>
