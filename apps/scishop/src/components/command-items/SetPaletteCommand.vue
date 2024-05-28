<script setup lang="ts">
import { SetPaletteCommand } from '@4bitlabs/sci0';
import { computed } from 'vue';
const props = defineProps<{ command: SetPaletteCommand; pals: unknown }>();
const pal = computed(() => props.command[1]);
</script>

<template>
  <li>{{ command[0] }}:{{ pal }}</li>
</template>
