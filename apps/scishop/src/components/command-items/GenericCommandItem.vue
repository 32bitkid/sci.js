<script setup lang="ts">
import { DrawCommand } from '@4bitlabs/sci0';
defineProps<{ command: DrawCommand; pals: unknown }>();
</script>

<template>
  <li>{{ command[0] }}</li>
</template>
